import pandas as pd
import numpy as np
import json
from math import radians, cos, sin, asin, sqrt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("================================================================")
print("  TRINETRA PREDICTION ENGINE - INFERENCE & METRIC EVALUATION    ")
print("================================================================")

# 1. Load Datasets & Trained Artifacts
try:
    with open("trained_model.json", "r") as f:
        model_artifacts = json.load(f)
    print("  [OK] Loaded trained_model.json successfully!")
except FileNotFoundError:
    print("  [ERROR] 'trained_model.json' not found. Please run 'python train_engine.py' first!")
    exit()

zones = pd.read_csv("zones.csv")
accounts = pd.read_csv("accounts.csv")
complaints = pd.read_csv("complaints.csv")
hops = pd.read_csv("hops.csv")
cashouts = pd.read_csv("cashout_events.csv")
typology_rules = pd.read_csv("typology_rules.csv")

# Extract Model Components
vocab = model_artifacts["module_1_cosine_priors"]["vocabulary"]
vectorizer = TfidfVectorizer(vocabulary=vocab)
vectorizer.fit(["dummy"]) # Initialize fitted vocabulary

typology_profiles = model_artifacts["module_1_cosine_priors"]["typology_profiles"]
zone_priors = model_artifacts["module_2_bayesian_estimator"]["priors_p_zone"]
mule_likelihoods = model_artifacts["module_2_bayesian_estimator"]["mule_zone_likelihoods"]
risk_registry = model_artifacts["module_3_risk_registry"]

# Haversine Distance Function
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    return 2 * R * asin(sqrt(a))

# 2. RUN INFERENCE PIPELINE
top1_correct = 0
top3_correct = 0
geo_errors = []
evaluated_cases = []

for _, complaint in complaints.iterrows():
    c_id = complaint['complaint_id']
    t_id = complaint['typology_id']
    t_name = complaint['typology_name']
    amount = complaint['amount_inr']
    
    # Ground Truth
    cashout_row = cashouts[cashouts['complaint_id'] == c_id].iloc[0]
    actual_zone = cashout_row['zone_id']
    actual_lat, actual_lng = cashout_row['lat'], cashout_row['lng']

    # --- MODULE 1: Cosine Similarity + Statistical Feature Distance ---
    query_vec = vectorizer.transform([t_name])
    profile = typology_profiles.get(t_id, {})
    
    # Amount & Velocity Normalized Deviation
    amount_diff = abs(amount - profile.get("mean_amount", amount)) / (profile.get("std_amount", 10000) + 1e-5)
    m1_score_weight = max(0.2, 1.0 - min(0.8, amount_diff * 0.1))

    # --- MODULE 2: Sequential Bayesian Posterior Updates ---
    cmp_hops = hops[hops['complaint_id'] == c_id].sort_values('hop_sequence')
    
    # Initialize Log-Posteriors with Zone Prior P(Z)
    log_posteriors = {z_id: np.log(zone_priors.get(z_id, 0.05)) for z_id in zones['zone_id']}

    # Dynamic Sequential Hop Update: P(Z | Hop_1, Hop_2, ...)
    for _, hop in cmp_hops.iterrows():
        to_acc = hop['to_account']
        acc_risk = risk_registry.get(to_acc, {}).get("risk_score", 0.1)
        
        for z_id in zones['zone_id']:
            # P(To_Account | Zone) Likelihood lookup
            likelihood = mule_likelihoods.get(z_id, {}).get(to_acc, 0.01)
            # Log Likelihood Accumulation with Risk Registry Weighting
            log_posteriors[z_id] += np.log(likelihood + 1e-6) * (1.0 + acc_risk)

    # Convert Log-Posteriors back to Normalized Probabilities
    max_log = max(log_posteriors.values())
    unnorm_probs = {z: np.exp(val - max_log) * m1_score_weight for z, val in log_posteriors.items()}
    total_p = sum(unnorm_probs.values())
    final_probabilities = {z: round(p / total_p, 4) for z, p in unnorm_probs.items()}

    # Rank Predicted Zones
    sorted_zones = sorted(final_probabilities.items(), key=lambda x: x[1], reverse=True)
    top1_pred = sorted_zones[0][0]
    top3_preds = [z[0] for z in sorted_zones[:3]]

    # --- MODULE 4: Recoverability Window Calculation ---
    elapsed_mins = float(cmp_hops['delay_minutes'].sum()) if not cmp_hops.empty else 15.0
    allowed_window_mins = profile.get("cashout_window_hrs", 2.0) * 60.0
    recoverability_score = round(max(0.0, min(1.0, (allowed_window_mins - elapsed_mins) / allowed_window_mins)), 2)

    # Metric Checks
    if top1_pred == actual_zone:
        top1_correct += 1
    if actual_zone in top3_preds:
        top3_correct += 1

    # Distance calculation (Predicted Zone Center vs Real ATM)
    pred_zone_info = zones[zones['zone_id'] == top1_pred].iloc[0]
    error_km = haversine(pred_zone_info['lat'], pred_zone_info['lng'], actual_lat, actual_lng)
    geo_errors.append(error_km)

    evaluated_cases.append({
        "complaint_id": c_id,
        "typology": t_name,
        "predicted_zone": top1_pred,
        "predicted_confidence": sorted_zones[0][1],
        "top3_zones": top3_preds,
        "actual_zone": actual_zone,
        "recoverability_score": recoverability_score,
        "error_km": round(error_km, 2)
    })

# Compute Final Aggregated Metrics
total_cases = len(complaints)
top1_acc = round((top1_correct / total_cases) * 100, 1)
top3_rec = round((top3_correct / total_cases) * 100, 1)
mean_geo_err = round(np.mean(geo_errors), 1)

summary_output = {
    "status": "Evaluated",
    "top1_accuracy": f"{top1_acc}%",
    "top3_recall": f"{top3_rec}%",
    "mean_geographic_error": f"{mean_geo_err} km",
    "total_cases_evaluated": total_cases
}

print("\n--- INFERENCE METRIC SUMMARY ---")
print(json.dumps(summary_output, indent=2))

# 3. Export Output to Frontend Data Path
export_payload = {
    "summary": summary_output,
    "evaluated_cases": evaluated_cases
}

try:
    with open("../src/data/mockPredictionsOutput.json", "w") as f:
        json.dump(export_payload, f, indent=2)
    print("\n  [OK] Successfully exported inference results to 'src/data/mockPredictionsOutput.json'!")
except Exception as e:
    with open("mockPredictionsOutput.json", "w") as f:
        json.dump(export_payload, f, indent=2)
    print("\n  [OK] Saved inference output locally to 'ml/mockPredictionsOutput.json'.")
