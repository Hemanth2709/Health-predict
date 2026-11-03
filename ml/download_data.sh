#!/usr/bin/env bash
# Downloads the CDC Diabetes Health Indicators dataset (BRFSS 2015, 253,680 rows)
# from the UCI Machine Learning Repository. DOI: 10.24432/C53919
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p data
curl -fsSL -o data/cdc_diabetes_health_indicators.csv \
  https://archive.ics.uci.edu/static/public/891/data.csv
echo "Saved ml/data/cdc_diabetes_health_indicators.csv ($(wc -l < data/cdc_diabetes_health_indicators.csv) lines)"
