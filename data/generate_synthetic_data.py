"""
PRAHARI — Synthetic Cyber-Fraud Cash-Out Dataset Generator
============================================================

Generates a realistic-but-synthetic dataset simulating cybercrime
complaints, their mule-account transaction chains, and cash-out
outcomes — for training/evaluating the cash-out location predictor.

Design principles (so this doesn't need rewriting for later rounds):
- Every "hardcoded" fact (typologies, zones, mule-reuse rate, hop
  ranges) lives in one CONFIG block at the top. Change numbers there,
  not the generation logic.
- Output schema is stable and matches the PostgreSQL schema this will
  eventually load into — column names won't need to change when you
  wire this into FastAPI/Postgres later.
- Deterministic (fixed seed) by default, so results are reproducible
  for demos and reports. Pass --seed to get a different draw.

Outputs (CSV, in --outdir):
  zones.csv         zone_id, district, state, lat, lng
  accounts.csv       account_id, type, first_seen, times_flagged
  complaints.csv     complaint_id, filed_time, fraud_type, amount, victim_district
  hops.csv           hop_id, complaint_id, hop_index, from_account, to_account, timestamp, bank
  cashout_events.csv complaint_id, actual_zone_id, actual_time, atm_id   (ground truth — for training/eval only)

Usage:
  python3 generate_synthetic_data.py --n_complaints 2000 --outdir ./out --seed 42
"""

import argparse
import csv
import json
import os
import random
from datetime import datetime, timedelta

# --------------------------------------------------------------------
# CONFIG — edit these, not the logic below, when tuning realism
# --------------------------------------------------------------------

# Real Indian districts used to ground the synthetic geography.
# (name, state, lat, lng) — public, static facts.
ZONES = [
    ("Central Delhi", "Delhi", 28.6519, 77.2315),
    ("South Delhi", "Delhi", 28.5245, 77.2066),
    ("Mumbai City", "Maharashtra", 18.9750, 72.8258),
    ("Mumbai Suburban", "Maharashtra", 19.0760, 72.8777),
    ("Pune", "Maharashtra", 18.5204, 73.8567),
    ("Bengaluru Urban", "Karnataka", 12.9716, 77.5946),
    ("Hyderabad", "Telangana", 17.3850, 78.4867),
    ("Chennai", "Tamil Nadu", 13.0827, 80.2707),
    ("Kolkata", "West Bengal", 22.5726, 88.3639),
    ("Jaipur", "Rajasthan", 26.9124, 75.7873),
    ("Lucknow", "Uttar Pradesh", 26.8467, 80.9462),
    ("Ahmedabad", "Gujarat", 23.0225, 72.5714),
    ("Patna", "Bihar", 25.5941, 85.1376),
    ("Bhopal", "Madhya Pradesh", 23.2599, 77.4126),
    ("Chandigarh", "Chandigarh", 30.7333, 76.7794),
    ("Kochi", "Kerala", 9.9312, 76.2673),
    ("Guwahati", "Assam", 26.1445, 91.7362),
    ("Indore", "Madhya Pradesh", 22.7196, 75.8577),
    ("Surat", "Gujarat", 21.1702, 72.8311),
    ("Nagpur", "Maharashtra", 21.1458, 79.0882),
]

# Fraud typologies with their characteristic behaviour.
# hop_range: (min, max) number of account-to-account hops before cash-out
# window_min_range: (min, max) minutes between last hop and cash-out
# preferred_zone_idx: indices into ZONES this typology clusters toward
#   (gives the reference-class matcher a genuine signal to learn)
TYPOLOGIES = {
    "OTP Fraud":        {"hop_range": (1, 2), "window_min_range": (10, 45),  "preferred_zone_idx": [0, 1, 2, 3]},
    "Loan-App Fraud":    {"hop_range": (2, 3), "window_min_range": (30, 90),  "preferred_zone_idx": [5, 6, 4]},
    "Investment Fraud":  {"hop_range": (3, 5), "window_min_range": (60, 240), "preferred_zone_idx": [2, 3, 8, 9]},
    "Romance Scam":      {"hop_range": (2, 4), "window_min_range": (45, 180), "preferred_zone_idx": [7, 15, 8]},
    "Job Fraud":         {"hop_range": (1, 3), "window_min_range": (20, 60),  "preferred_zone_idx": [10, 12, 13]},
    "SIM-Swap":          {"hop_range": (1, 2), "window_min_range": (15, 40),  "preferred_zone_idx": [0, 1, 5]},
}

BANKS = ["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "BOB", "Paytm Payments Bank"]

# Fraction of mule/beneficiary accounts that are deliberately reused
# across multiple complaints — this is what makes the risk-registry
# (cross-complaint) feature meaningful instead of trivial.
MULE_REUSE_RATE = 0.12
# How many times a "recurring" mule account gets reused, on average
MULE_REUSE_COUNT_RANGE = (2, 5)
# Size of the shared recurring-mule pool relative to n_complaints
RECURRING_POOL_FRACTION = 0.04

# Fraction of complaints where cash-out is NOT actually recovered in time
# (used later to make alert outcomes realistic — not everything is a win)
BASE_MISS_RATE = 0.30


# --------------------------------------------------------------------
# Generation logic — should not need edits for later rounds
# --------------------------------------------------------------------

def rand_time(base, max_minutes_after):
    return base + timedelta(minutes=random.randint(0, max_minutes_after))


def gen_zones():
    rows = []
    for i, (district, state, lat, lng) in enumerate(ZONES):
        rows.append({
            "zone_id": f"Z{i:03d}",
            "district": district,
            "state": state,
            "lat": lat,
            "lng": lng,
        })
    return rows


def gen_account_id(counter):
    return f"AC{counter:06d}"


def build_recurring_mule_pool(n_complaints, start_counter):
    pool_size = max(3, int(n_complaints * RECURRING_POOL_FRACTION))
    pool = []
    counter = start_counter
    for _ in range(pool_size):
        pool.append(gen_account_id(counter))
        counter += 1
    return pool, counter


def generate(n_complaints, seed, outdir):
    random.seed(seed)
    os.makedirs(outdir, exist_ok=True)

    zones = gen_zones()
    zone_by_idx = {i: z for i, z in enumerate(zones)}

    accounts = {}  # account_id -> row dict
    account_counter = 1

    def new_account(acc_type, seen_time):
        nonlocal account_counter
        aid = gen_account_id(account_counter)
        account_counter += 1
        accounts[aid] = {
            "account_id": aid,
            "type": acc_type,
            "first_seen": seen_time.isoformat(),
            "times_flagged": 0,
        }
        return aid

    recurring_pool, account_counter = build_recurring_mule_pool(n_complaints, account_counter)
    for aid in recurring_pool:
        accounts[aid] = {
            "account_id": aid,
            "type": "mule",
            "first_seen": None,  # set on first real use
            "times_flagged": 0,
        }

    complaints = []
    hops = []
    cashout_events = []

    base_date = datetime(2026, 9, 1, 6, 0, 0)
    hop_id_counter = 1

    for i in range(n_complaints):
        complaint_id = f"CYB-2026-{10000+i:05d}"
        fraud_type = random.choice(list(TYPOLOGIES.keys()))
        typ = TYPOLOGIES[fraud_type]
        filed_time = rand_time(base_date, 60 * 24 * 30)  # spread over a month
        amount = random.choice([2000, 5000, 8000, 15000, 25000, 48000, 75000, 120000, 250000])
        victim_zone_idx = random.randrange(len(zones))
        victim_district = zone_by_idx[victim_zone_idx]["district"]

        complaints.append({
            "complaint_id": complaint_id,
            "filed_time": filed_time.isoformat(),
            "fraud_type": fraud_type,
            "amount": amount,
            "victim_district": victim_district,
        })

        # victim account
        victim_acc = new_account("victim", filed_time)
        if accounts[victim_acc]["first_seen"] is None:
            accounts[victim_acc]["first_seen"] = filed_time.isoformat()

        n_hops = random.randint(*typ["hop_range"])
        current_from = victim_acc
        current_time = filed_time

        for h in range(n_hops):
            is_last_hop = (h == n_hops - 1)
            use_recurring = random.random() < MULE_REUSE_RATE and recurring_pool
            if use_recurring:
                to_acc = random.choice(recurring_pool)
                if accounts[to_acc]["first_seen"] is None:
                    accounts[to_acc]["first_seen"] = current_time.isoformat()
                accounts[to_acc]["times_flagged"] += 1
            else:
                acc_type = "beneficiary" if is_last_hop else "mule"
                to_acc = new_account(acc_type, current_time)

            hop_time = rand_time(current_time, 30)
            hops.append({
                "hop_id": f"H{hop_id_counter:07d}",
                "complaint_id": complaint_id,
                "hop_index": h + 1,
                "from_account": current_from,
                "to_account": to_acc,
                "timestamp": hop_time.isoformat(),
                "bank": random.choice(BANKS),
            })
            hop_id_counter += 1
            current_from = to_acc
            current_time = hop_time

        # cash-out ground truth: typology-preferred zone, with some noise
        if random.random() < 0.8 and typ["preferred_zone_idx"]:
            actual_zone_idx = random.choice(typ["preferred_zone_idx"])
        else:
            actual_zone_idx = random.randrange(len(zones))

        window_minutes = random.randint(*typ["window_min_range"])
        actual_time = rand_time(current_time, window_minutes)
        atm_id = f"ATM-{zone_by_idx[actual_zone_idx]['zone_id']}-{random.randint(1,6):02d}"

        recovered = random.random() > BASE_MISS_RATE

        cashout_events.append({
            "complaint_id": complaint_id,
            "actual_zone_id": zone_by_idx[actual_zone_idx]["zone_id"],
            "actual_time": actual_time.isoformat(),
            "atm_id": atm_id,
            "recovered": recovered,
        })

    return zones, list(accounts.values()), complaints, hops, cashout_events


def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)


def main():
    ap = argparse.ArgumentParser(description="Generate PRAHARI synthetic cash-out dataset")
    ap.add_argument("--n_complaints", type=int, default=2000)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--outdir", type=str, default="./out")
    args = ap.parse_args()

    zones, accounts, complaints, hops, cashout_events = generate(
        args.n_complaints, args.seed, args.outdir
    )

    write_csv(os.path.join(args.outdir, "zones.csv"), zones,
              ["zone_id", "district", "state", "lat", "lng"])
    write_csv(os.path.join(args.outdir, "accounts.csv"), accounts,
              ["account_id", "type", "first_seen", "times_flagged"])
    write_csv(os.path.join(args.outdir, "complaints.csv"), complaints,
              ["complaint_id", "filed_time", "fraud_type", "amount", "victim_district"])
    write_csv(os.path.join(args.outdir, "hops.csv"), hops,
              ["hop_id", "complaint_id", "hop_index", "from_account", "to_account", "timestamp", "bank"])
    write_csv(os.path.join(args.outdir, "cashout_events.csv"), cashout_events,
              ["complaint_id", "actual_zone_id", "actual_time", "atm_id", "recovered"])

    print(f"Generated {len(complaints)} complaints, {len(hops)} hops, "
          f"{len(accounts)} accounts, {len(zones)} zones.")
    print(f"Recurring mule pool size: {int(args.n_complaints * RECURRING_POOL_FRACTION)}")
    print(f"Written to: {os.path.abspath(args.outdir)}")


if __name__ == "__main__":
    main()
