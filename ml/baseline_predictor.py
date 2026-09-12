import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
import numpy as np
import json
import xgboost as xgb
from math import radians, cos, sin, asin, sqrt
from scripts.data_prep.feature_engineering import get_engineered_data

print("================================================================")
print("  TRINETRA PREDICTION ENGINE - EVALUATION (NO LEAKAGE) ")
print("================================================================")

# 1. Load STRICTLY Test Data
c_feat, h_feat, targets = get_engineered_data("test", "../data/generated/splits")
zones_df = pd.read_csv("../data/generated/full/zones.csv")

with open("../data/generated/splits/test_special_splits.json", "r") as f:
    special_splits = json.load(f)
    
known_mules = set(special_splits["known_mule_cases"])
unseen_mules = set(special_splits["unseen_mule_cases"])

print(f"Loaded {len(c_feat)} test cases.")

try:
    with open("trained_model.json", "r") as f:
        model_artifacts = json.load(f)
    xgb_model = xgb.XGBClassifier()
    xgb_model.load_model("xgboost_model.json")
    print("  [OK] Loaded trained models successfully!")
except FileNotFoundError:
    print("  [ERROR] Trained models not found. Please run 'python3 train_engine.py' first!")
    sys.exit(1)

# Extract Model Components
global_prior = model_artifacts["global_prior"]
typology_priors = model_artifacts["typology_priors"]
mule_zone_likelihoods = model_artifacts["mule_zone_likelihoods"]
node_risk_registry = model_artifacts["node_risk_registry"]
encoders = model_artifacts["encoders"]
xgb_features = model_artifacts["xgb_features"]

zone_list = encoders["target_zone"]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    return 2 * R * asin(sqrt(a))

def get_zone_coords(z_id):
    row = zones_df[zones_df['zone_id'] == z_id]
    if not row.empty:
        return row.iloc[0]['lat'], row.iloc[0]['lng']
    return 0.0, 0.0

def evaluate_predictions(predictions, targets, c_ids, split_name):
    """
    predictions: dict { c_id: { zone_id: prob } }
    """
    top1 = 0
    top3 = 0
    geo_errors = []
    
    count = 0
    for c_id in c_ids:
        if c_id not in predictions:
            continue
            
        preds = predictions[c_id]
        sorted_zones = sorted(preds.items(), key=lambda x: x[1], reverse=True)
        top_zones = [z[0] for z in sorted_zones]
        
        actual_zone = targets[targets['complaint_id'] == c_id].iloc[0]['zone_id']
        
        if top_zones[0] == actual_zone:
            top1 += 1
        if actual_zone in top_zones[:3]:
            top3 += 1
            
        pred_lat, pred_lng = get_zone_coords(top_zones[0])
        actual_lat, actual_lng = get_zone_coords(actual_zone)
        geo_errors.append(haversine(pred_lat, pred_lng, actual_lat, actual_lng))
        
        count += 1
        
    return {
        "count": count,
        "top1_acc": round((top1 / count) * 100, 1) if count > 0 else 0.0,
        "top3_recall": round((top3 / count) * 100, 1) if count > 0 else 0.0,
        "mean_geo_err_km": round(np.mean(geo_errors), 1) if count > 0 else 0.0
    }

# 2. RUN INFERENCE FOR ALL MODELS
# M0: Global Prior
m0_preds = {row['complaint_id']: global_prior for _, row in c_feat.iterrows()}

# M1: Typology Prior
m1_preds = {}
for _, row in c_feat.iterrows():
    m1_preds[row['complaint_id']] = typology_priors.get(row['typology_id'], global_prior)

# M2: XGBoost Feature Ranker
print("Running XGBoost Inference...")
c_full = c_feat.copy()
first_hops = h_feat[h_feat['hop_sequence'] == 1]
xgb_df = c_full.merge(first_hops[['complaint_id', 'time_since_incident_mins', 'to_account_historical_flags', 'is_mule', 'amount_retained_ratio']], on='complaint_id', how='left')
xgb_df.fillna(0, inplace=True)

try:
    xgb_df['victim_state_encoded'] = xgb_df['victim_state'].apply(lambda x: encoders['state'].index(x) if x in encoders['state'] else 0)
    xgb_df['typology_encoded'] = xgb_df['typology_id'].apply(lambda x: encoders['typology'].index(x) if x in encoders['typology'] else 0)
except ValueError:
    pass

X_test = xgb_df[xgb_features]
xgb_probs = xgb_model.predict_proba(X_test)

m2_preds = {}
for i, row in xgb_df.iterrows():
    m2_preds[row['complaint_id']] = {zone_list[j]: float(xgb_probs[i][j]) for j in range(len(zone_list))}

# M3 & M4: Sequential Bayesian Estimators
print("Running Sequential Bayesian Inference...")
m3_preds_hop1 = {}
m3_preds_hop3 = {}
m4_preds_hop3 = {}

for _, row in c_feat.iterrows():
    c_id = row['complaint_id']
    base_prior = typology_priors.get(row['typology_id'], global_prior)
    
    # Initialize log posteriors
    log_post3 = {z: np.log(p + 1e-6) for z, p in base_prior.items()}
    log_post4 = {z: np.log(p + 1e-6) for z, p in base_prior.items()}
    
    c_hops = h_feat[h_feat['complaint_id'] == c_id].sort_values('hop_sequence')
    
    for _, hop in c_hops.iterrows():
        to_acc = hop['to_account']
        acc_risk_weight = node_risk_registry.get(to_acc, {}).get("risk_weight", 1.0)
        
        for z in zone_list:
            lh = mule_zone_likelihoods.get(z, {}).get(to_acc, 0.01) # Unseen mule smoothing
            log_lh = np.log(lh + 1e-6)
            
            log_post3[z] += log_lh
            log_post4[z] += (log_lh * acc_risk_weight)
            
        if hop['hop_sequence'] == 1:
            max_log = max(log_post3.values())
            unnorm = {z: np.exp(val - max_log) for z, val in log_post3.items()}
            tot = sum(unnorm.values())
            m3_preds_hop1[c_id] = {z: p/tot for z, p in unnorm.items()}
            
    # Final Hop 3+
    max_log = max(log_post3.values())
    unnorm = {z: np.exp(val - max_log) for z, val in log_post3.items()}
    tot = sum(unnorm.values())
    m3_preds_hop3[c_id] = {z: p/tot for z, p in unnorm.items()}
    
    max_log = max(log_post4.values())
    unnorm = {z: np.exp(val - max_log) for z, val in log_post4.items()}
    tot = sum(unnorm.values())
    m4_preds_hop3[c_id] = {z: p/tot for z, p in unnorm.items()}

# 3. COMPUTE EVALUATION METRICS
print("Computing Metrics...")

all_c_ids = list(c_feat['complaint_id'])

metrics = {
    "overall": {
        "M0_Global_Prior": evaluate_predictions(m0_preds, targets, all_c_ids, "overall"),
        "M1_Typology_Prior": evaluate_predictions(m1_preds, targets, all_c_ids, "overall"),
        "M2_XGBoost_T1": evaluate_predictions(m2_preds, targets, all_c_ids, "overall"),
        "M3_Bayes_Hop1": evaluate_predictions(m3_preds_hop1, targets, all_c_ids, "overall"),
        "M3_Bayes_HopN": evaluate_predictions(m3_preds_hop3, targets, all_c_ids, "overall"),
        "M4_NetworkEnriched_HopN": evaluate_predictions(m4_preds_hop3, targets, all_c_ids, "overall")
    },
    "known_mule": {
        "M2_XGBoost_T1": evaluate_predictions(m2_preds, targets, known_mules, "known_mule"),
        "M4_NetworkEnriched_HopN": evaluate_predictions(m4_preds_hop3, targets, known_mules, "known_mule")
    },
    "unseen_mule": {
        "M2_XGBoost_T1": evaluate_predictions(m2_preds, targets, unseen_mules, "unseen_mule"),
        "M4_NetworkEnriched_HopN": evaluate_predictions(m4_preds_hop3, targets, unseen_mules, "unseen_mule")
    }
}

print(json.dumps(metrics, indent=2))

with open("model_comparison.json", "w") as f:
    json.dump(metrics, f, indent=2)
    
# Save mock JSON for frontend using best model (M4)
frontend_mock = {
    "summary": metrics["overall"]["M4_NetworkEnriched_HopN"],
    "evaluated_cases": []
}

# Just add top 50 cases to not bloat the json
for c_id in all_c_ids[:50]:
    preds = m4_preds_hop3.get(c_id, m1_preds.get(c_id))
    sorted_zones = sorted(preds.items(), key=lambda x: x[1], reverse=True)
    actual_zone = targets[targets['complaint_id'] == c_id].iloc[0]['zone_id']
    frontend_mock["evaluated_cases"].append({
        "complaint_id": c_id,
        "predicted_zone": sorted_zones[0][0],
        "predicted_confidence": round(sorted_zones[0][1], 2),
        "top3_zones": [z[0] for z in sorted_zones[:3]],
        "actual_zone": actual_zone
    })

with open("../frontend-nisha/frontend-Nisha/src/data/mockPredictionsOutput.json", "w") as f:
    json.dump(frontend_mock, f, indent=2)
    
print("\n[OK] Evaluation completed. Reports saved.")
