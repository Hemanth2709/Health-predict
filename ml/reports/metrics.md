# Model evaluation

Dataset: CDC Diabetes Health Indicators (BRFSS 2015), 253,680 rows. Stratified 80/20 train/test split (seed 42); 5-fold CV on the training split.

## Metabolic (`Diabetes_binary`, prevalence 13.9%)

| Model | ROC-AUC | PR-AUC | Brier | Log loss |
|---|---|---|---|---|
| **Logistic regression (served)** | **0.7937** (CV 0.7987 ± 0.0019) | 0.3721 | 0.1026 | 0.3344 |
| Gradient boosting | 0.7966 | 0.378 | 0.102 | 0.3324 |
| Prevalence baseline | 0.5 | 0.1393 | 0.1199 | 0.4037 |

Calibration of the served model (test set, deciles):

| Decile | Mean predicted | Observed |
|---|---|---|
| 1 | 0.010 | 0.009 |
| 2 | 0.022 | 0.017 |
| 3 | 0.036 | 0.038 |
| 4 | 0.053 | 0.051 |
| 5 | 0.075 | 0.078 |
| 6 | 0.105 | 0.110 |
| 7 | 0.146 | 0.155 |
| 8 | 0.204 | 0.209 |
| 9 | 0.287 | 0.302 |
| 10 | 0.460 | 0.426 |

## Cardiovascular (`HeartDiseaseorAttack`, prevalence 9.4%)

| Model | ROC-AUC | PR-AUC | Brier | Log loss |
|---|---|---|---|---|
| **Logistic regression (served)** | **0.8199** (CV 0.8206 ± 0.0047) | 0.3187 | 0.0738 | 0.2522 |
| Gradient boosting | 0.8233 | 0.3253 | 0.0731 | 0.2496 |
| Prevalence baseline | 0.5 | 0.0942 | 0.0853 | 0.3121 |

Calibration of the served model (test set, deciles):

| Decile | Mean predicted | Observed |
|---|---|---|
| 1 | 0.006 | 0.004 |
| 2 | 0.011 | 0.009 |
| 3 | 0.019 | 0.013 |
| 4 | 0.029 | 0.024 |
| 5 | 0.043 | 0.038 |
| 6 | 0.061 | 0.059 |
| 7 | 0.087 | 0.096 |
| 8 | 0.126 | 0.137 |
| 9 | 0.190 | 0.207 |
| 10 | 0.369 | 0.354 |
