"""
Train the VitalScope risk models on the CDC Diabetes Health Indicators dataset
(BRFSS 2015, 253,680 survey responses, UCI ML Repository, DOI 10.24432/C53919).

Two binary classifiers are trained on the same set of features that the web form
can collect:

  * metabolic      -> target Diabetes_binary        (prediabetes or diabetes)
  * cardiovascular -> target HeartDiseaseorAttack   (coronary heart disease or MI)

For each target the script compares a regularised logistic regression with a
histogram gradient-boosting model and a prevalence-only baseline. The logistic
regression is exported to `lib/ml/model.json` and served by the Next.js API
(`app/api/predict/route.ts`): it is interpretable (per-feature contributions are
shown to the user), well calibrated, and small enough to run without a Python
server.

Usage:
    ./ml/download_data.sh
    python ml/train.py
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, log_loss, roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "ml" / "data" / "cdc_diabetes_health_indicators.csv"
MODEL_OUT = ROOT / "lib" / "ml" / "model.json"
PARITY_OUT = ROOT / "tests" / "fixtures" / "model_parity.json"
REPORT_OUT = ROOT / "ml" / "reports"
SEED = 42

# BRFSS age buckets (1 = 18-24 ... 13 = 80+). Bucket 1 is the reference level.
AGE_LEVELS = list(range(2, 14))
BMI_CENTER, BMI_SCALE = 28.0, 6.0

# Deliberately excluded although the form could map them:
#   CholCheck          - a screening indicator, not a risk factor. People already diagnosed get
#                        checked more often, so it gets a large positive weight (reverse causation).
#   HvyAlcoholConsump  - comes out "protective" because diagnosed people tend to stop drinking.
# Keeping them would raise AUC slightly but produce misleading explanations for users.
BINARY_FEATURES = [
    "HighBP",
    "HighChol",
    "Smoker",
    "Stroke",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "Sex",
]

TARGETS = {
    "metabolic": {"target": "Diabetes_binary", "extra": ["HeartDiseaseorAttack"]},
    "cardiovascular": {"target": "HeartDiseaseorAttack", "extra": ["Diabetes_binary"]},
}


def build_features(df: pd.DataFrame, extra: list[str]) -> pd.DataFrame:
    """Feature engineering. Must stay in sync with `lib/ml/features.ts`."""
    out = pd.DataFrame(index=df.index)
    bmi = (df["BMI"].clip(12, 60) - BMI_CENTER) / BMI_SCALE
    out["bmi"] = bmi
    out["bmi_sq"] = bmi**2
    for level in AGE_LEVELS:
        out[f"age_{level}"] = (df["Age"] == level).astype(float)
    for col in BINARY_FEATURES + extra:
        out[col] = df[col].astype(float)
    return out


def metrics(y: np.ndarray, p: np.ndarray) -> dict[str, float]:
    return {
        "roc_auc": round(float(roc_auc_score(y, p)), 4),
        "pr_auc": round(float(average_precision_score(y, p)), 4),
        "brier": round(float(brier_score_loss(y, p)), 4),
        "log_loss": round(float(log_loss(y, p)), 4),
    }


def calibration_table(y: np.ndarray, p: np.ndarray, bins: int = 10) -> list[dict[str, float]]:
    order = np.argsort(p)
    rows = []
    for chunk in np.array_split(order, bins):
        rows.append(
            {
                "mean_predicted": round(float(p[chunk].mean()), 4),
                "observed_rate": round(float(y[chunk].mean()), 4),
                "n": int(len(chunk)),
            }
        )
    return rows


def main() -> None:
    if not DATA.exists():
        raise SystemExit(f"Dataset not found at {DATA}. Run ./ml/download_data.sh first.")

    df = pd.read_csv(DATA)
    print(f"Loaded {len(df):,} rows")

    export: dict = {
        "version": 1,
        "trained_on": "CDC Diabetes Health Indicators (BRFSS 2015), UCI ML Repository, DOI 10.24432/C53919",
        "trained_at": date.today().isoformat(),
        "n_rows": int(len(df)),
        "bmi_center": BMI_CENTER,
        "bmi_scale": BMI_SCALE,
        "models": {},
    }
    report: dict = {"dataset_rows": int(len(df)), "models": {}}
    parity: dict = {}

    for name, spec in TARGETS.items():
        y = df[spec["target"]].to_numpy().astype(int)
        X = build_features(df, spec["extra"])
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=SEED
        )

        lr = LogisticRegression(C=1.0, max_iter=2000)
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
        cv_auc = cross_val_score(lr, X_train, y_train, cv=cv, scoring="roc_auc")
        lr.fit(X_train, y_train)
        p_lr = lr.predict_proba(X_test)[:, 1]

        gbm = HistGradientBoostingClassifier(max_iter=300, learning_rate=0.05, random_state=SEED)
        gbm.fit(X_train, y_train)
        p_gbm = gbm.predict_proba(X_test)[:, 1]

        p_base = np.full_like(p_lr, y_train.mean())

        results = {
            "target": spec["target"],
            "prevalence": round(float(y.mean()), 4),
            "n_train": int(len(y_train)),
            "n_test": int(len(y_test)),
            "logistic_regression": {**metrics(y_test, p_lr), "cv5_roc_auc_mean": round(float(cv_auc.mean()), 4),
                                    "cv5_roc_auc_std": round(float(cv_auc.std()), 4)},
            "gradient_boosting": metrics(y_test, p_gbm),
            "baseline_prevalence": {"roc_auc": 0.5, **{k: v for k, v in metrics(y_test, p_base).items() if k != "roc_auc"}},
            "calibration_logistic_regression": calibration_table(y_test, p_lr),
        }
        report["models"][name] = results
        print(f"\n[{name}] target={spec['target']} prevalence={results['prevalence']:.3f}")
        for model_name in ("logistic_regression", "gradient_boosting", "baseline_prevalence"):
            print(f"  {model_name:22s} {results[model_name]}")

        # Fixtures for tests/model.test.ts: the TypeScript inference must match sklearn.
        sample = X_test.sample(50, random_state=SEED).index
        raw_cols = ["BMI", "Age"] + BINARY_FEATURES + spec["extra"]
        parity[name] = [
            {"raw": {c: float(df.loc[i, c]) for c in raw_cols}, "probability": float(p)}
            for i, p in zip(sample, lr.predict_proba(X.loc[sample])[:, 1])
        ]

        # Percentile lookup: where does a prediction sit among the test population?
        quantiles = np.quantile(p_lr, np.linspace(0, 1, 101))

        export["models"][name] = {
            "target": spec["target"],
            "prevalence": float(y.mean()),
            "intercept": float(lr.intercept_[0]),
            "features": list(X.columns),
            "coefficients": [float(c) for c in lr.coef_[0]],
            "means": [float(m) for m in X_train.mean().to_numpy()],
            "percentiles": [float(q) for q in quantiles],
            "metrics": results["logistic_regression"],
        }

    MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
    MODEL_OUT.write_text(json.dumps(export, indent=2) + "\n")
    PARITY_OUT.parent.mkdir(parents=True, exist_ok=True)
    PARITY_OUT.write_text(json.dumps(parity) + "\n")
    REPORT_OUT.mkdir(parents=True, exist_ok=True)
    (REPORT_OUT / "metrics.json").write_text(json.dumps(report, indent=2) + "\n")
    write_markdown_report(report)
    print(f"\nWrote {MODEL_OUT.relative_to(ROOT)} and {REPORT_OUT.relative_to(ROOT)}/")


def write_markdown_report(report: dict) -> None:
    lines = [
        "# Model evaluation",
        "",
        f"Dataset: CDC Diabetes Health Indicators (BRFSS 2015), {report['dataset_rows']:,} rows. "
        "Stratified 80/20 train/test split (seed 42); 5-fold CV on the training split.",
        "",
    ]
    for name, r in report["models"].items():
        lr, gb, base = r["logistic_regression"], r["gradient_boosting"], r["baseline_prevalence"]
        lines += [
            f"## {name.capitalize()} (`{r['target']}`, prevalence {r['prevalence']:.1%})",
            "",
            "| Model | ROC-AUC | PR-AUC | Brier | Log loss |",
            "|---|---|---|---|---|",
            f"| **Logistic regression (served)** | **{lr['roc_auc']}** (CV {lr['cv5_roc_auc_mean']} ± {lr['cv5_roc_auc_std']}) | {lr['pr_auc']} | {lr['brier']} | {lr['log_loss']} |",
            f"| Gradient boosting | {gb['roc_auc']} | {gb['pr_auc']} | {gb['brier']} | {gb['log_loss']} |",
            f"| Prevalence baseline | 0.5 | {base['pr_auc']} | {base['brier']} | {base['log_loss']} |",
            "",
            "Calibration of the served model (test set, deciles):",
            "",
            "| Decile | Mean predicted | Observed |",
            "|---|---|---|",
        ]
        for i, row in enumerate(r["calibration_logistic_regression"], 1):
            lines.append(f"| {i} | {row['mean_predicted']:.3f} | {row['observed_rate']:.3f} |")
        lines.append("")
    (REPORT_OUT / "metrics.md").write_text("\n".join(lines))


if __name__ == "__main__":
    main()
