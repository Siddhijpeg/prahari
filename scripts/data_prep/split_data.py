import pandas as pd
import os
import json
import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", type=str, default="../../data/generated/full")
    parser.add_argument("--out_dir", type=str, default="../../data/generated/splits")
    return parser.parse_args()

def run_split():
    args = parse_args()
    os.makedirs(args.out_dir, exist_ok=True)
    
    print("Loading full dataset for splitting...")
    complaints = pd.read_csv(os.path.join(args.data_dir, "complaints.csv"))
    hops = pd.read_csv(os.path.join(args.data_dir, "hops.csv"))
    cashouts = pd.read_csv(os.path.join(args.data_dir, "cashout_events.csv"))
    
    # Sort complaints chronologically by available_timestamp
    complaints['available_timestamp'] = pd.to_datetime(complaints['available_timestamp'])
    complaints = complaints.sort_values(by='available_timestamp').reset_index(drop=True)
    
    total = len(complaints)
    train_idx = int(total * 0.7)
    val_idx = int(total * 0.85)
    
    # Split complaint IDs
    train_cmps = complaints.iloc[:train_idx]
    val_cmps = complaints.iloc[train_idx:val_idx]
    test_cmps = complaints.iloc[val_idx:]
    
    print(f"Split sizes -> Train: {len(train_cmps)}, Val: {len(val_cmps)}, Test: {len(test_cmps)}")
    
    # Save base splits
    train_cmps.to_csv(os.path.join(args.out_dir, "train_complaints.csv"), index=False)
    val_cmps.to_csv(os.path.join(args.out_dir, "val_complaints.csv"), index=False)
    test_cmps.to_csv(os.path.join(args.out_dir, "test_complaints.csv"), index=False)
    
    # Split hops and cashouts correspondingly
    def save_related(split_cmps, prefix):
        c_ids = set(split_cmps['complaint_id'])
        h = hops[hops['complaint_id'].isin(c_ids)]
        c = cashouts[cashouts['complaint_id'].isin(c_ids)]
        h.to_csv(os.path.join(args.out_dir, f"{prefix}_hops.csv"), index=False)
        c.to_csv(os.path.join(args.out_dir, f"{prefix}_cashout_events.csv"), index=False)
        return h
        
    train_hops = save_related(train_cmps, "train")
    val_hops = save_related(val_cmps, "val")
    test_hops = save_related(test_cmps, "test")
    
    # --- Entity Leakage Slices ---
    print("Generating specialized evaluation splits...")
    # Identify mules seen in train
    train_mules = set(train_hops['to_account']).union(set(train_hops['from_account']))
    
    test_c_ids = list(test_cmps['complaint_id'])
    
    known_mule_cids = []
    unseen_mule_cids = []
    
    for c_id in test_c_ids:
        c_hops = test_hops[test_hops['complaint_id'] == c_id]
        c_mules = set(c_hops['to_account'])
        
        # If ALL mules in this complaint are totally unseen, it's unseen_mule
        # If at least one mule was in train, it's known_mule
        if c_mules.isdisjoint(train_mules):
            unseen_mule_cids.append(c_id)
        else:
            known_mule_cids.append(c_id)
            
    print(f"Test Set - Known Mule Cases: {len(known_mule_cids)}")
    print(f"Test Set - Unseen Mule Cases: {len(unseen_mule_cids)}")
    
    # Save the special ID lists
    with open(os.path.join(args.out_dir, "test_special_splits.json"), "w") as f:
        json.dump({
            "known_mule_cases": known_mule_cids,
            "unseen_mule_cases": unseen_mule_cids
        }, f, indent=2)
        
    print(f"Splits completed successfully in {args.out_dir}")

if __name__ == "__main__":
    run_split()
