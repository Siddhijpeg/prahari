# PRAHARI — Predictive Cash-Out Intelligence Framework (SIH26184)

## Structure
- `frontend/` — UI prototype (index.html = latest, archive/ = earlier iterations)
- `data/` — synthetic dataset generator + generated CSVs
- `ml/` — prediction logic, starting with the baseline evaluator
- `backend/` — FastAPI service (not built yet)

## Data
Regenerate the synthetic dataset anytime:
```
cd data
python3 generate_synthetic_data.py --n_complaints 2000 --outdir ./out --seed 42
```

## Baseline model
Reference-class prior — predicts cash-out zone using only fraud_type,
no hop/registry signal. This is the number every later model must beat.
```
cd ml
python3 baseline_predictor.py --datadir ../data/out
```
Current baseline (seed=42/7, n=2000): Top-1 ~22%, Top-3 ~74.5%.

## Status
- [x] UI prototype (multi-screen, click-through demo)
- [x] Synthetic dataset generator
- [x] Baseline (reference-class) predictor + eval
- [ ] Sequential estimator (hop-by-hop posterior update)
- [ ] Risk registry (cross-complaint account tracking)
- [ ] Decision engine (confidence x recoverability)
- [ ] FastAPI backend wiring UI to real predictions
