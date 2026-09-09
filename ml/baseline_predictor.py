"""
PRAHARI — Baseline Predictor & Evaluation (Feature A, simplest version)
========================================================================

What this does, in plain terms:
  1. Splits complaints into a TRAIN set and a TEST set.
  2. From TRAIN only, learns: "for each fraud_type, which zones did
     cash-out actually happen in, and how often?" — this is the
     reference-class prior described in the design doc (cold-start
     solution: predict from typology resemblance, not case history).
  3. For every complaint in TEST, predicts a ranked Top-3 list of
     zones using ONLY that complaint's fraud_type (no hops, no
     registry — this is the simplest possible version, the baseline
     everything else must beat).
  4. Scores itself: Top-1 hit rate, Top-3 hit rate, and average
     distance error in km between predicted and actual zone.

Why this matters for the pitch:
  This IS the "naive historical heatmap" baseline that other teams
  will show. Running this number now gives you a concrete "our full
  estimator beats this by X%" claim later — you cannot claim that
  without first measuring the baseline.

Next script after this (not built yet): the same evaluation, but
using the sequential estimator that also looks at hops + registry —
compare its Top-K numbers against this file's output.

Usage:
  python3 baseline_predictor.py --datadir ../data/out
"""

import argparse
import csv
import math
import os
import random
from collections import defaultdict


def load_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def main():
    ap = argparse.ArgumentParser(description="PRAHARI baseline reference-class predictor")
    ap.add_argument("--datadir", type=str, default="../data/out")
    ap.add_argument("--test_fraction", type=float, default=0.2)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--top_k", type=int, default=3)
    args = ap.parse_args()

    random.seed(args.seed)

    complaints = load_csv(os.path.join(args.datadir, "complaints.csv"))
    cashouts = load_csv(os.path.join(args.datadir, "cashout_events.csv"))
    zones = load_csv(os.path.join(args.datadir, "zones.csv"))

    zone_coords = {z["zone_id"]: (float(z["lat"]), float(z["lng"])) for z in zones}
    actual_zone_by_complaint = {c["complaint_id"]: c["actual_zone_id"] for c in cashouts}
    fraud_type_by_complaint = {c["complaint_id"]: c["fraud_type"] for c in complaints}

    complaint_ids = [c["complaint_id"] for c in complaints if c["complaint_id"] in actual_zone_by_complaint]
    random.shuffle(complaint_ids)
    n_test = int(len(complaint_ids) * args.test_fraction)
    test_ids = set(complaint_ids[:n_test])
    train_ids = [cid for cid in complaint_ids if cid not in test_ids]

    # --- learn the reference-class prior from TRAIN only ---
    zone_counts_by_type = defaultdict(lambda: defaultdict(int))
    for cid in train_ids:
        ftype = fraud_type_by_complaint[cid]
        azone = actual_zone_by_complaint[cid]
        zone_counts_by_type[ftype][azone] += 1

    ranked_zones_by_type = {}
    for ftype, counts in zone_counts_by_type.items():
        ranked = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)
        ranked_zones_by_type[ftype] = [z for z, _ in ranked]

    # global fallback (all zones ranked by overall frequency) for any
    # fraud_type that had zero training examples
    global_counts = defaultdict(int)
    for counts in zone_counts_by_type.values():
        for z, c in counts.items():
            global_counts[z] += c
    global_ranked = [z for z, _ in sorted(global_counts.items(), key=lambda kv: kv[1], reverse=True)]

    # --- evaluate on TEST ---
    top1_hits = 0
    topk_hits = 0
    dist_errors = []
    n_eval = 0

    for cid in test_ids:
        ftype = fraud_type_by_complaint[cid]
        actual = actual_zone_by_complaint[cid]
        predicted = ranked_zones_by_type.get(ftype, global_ranked)
        if not predicted:
            continue
        n_eval += 1

        if predicted[0] == actual:
            top1_hits += 1
        if actual in predicted[:args.top_k]:
            topk_hits += 1

        if actual in zone_coords and predicted[0] in zone_coords:
            alat, alng = zone_coords[actual]
            plat, plng = zone_coords[predicted[0]]
            dist_errors.append(haversine_km(alat, alng, plat, plng))

    top1_rate = top1_hits / n_eval if n_eval else 0
    topk_rate = topk_hits / n_eval if n_eval else 0
    mean_dist = sum(dist_errors) / len(dist_errors) if dist_errors else 0

    print("=" * 60)
    print("PRAHARI — Baseline (reference-class prior) evaluation")
    print("=" * 60)
    print(f"Train complaints : {len(train_ids)}")
    print(f"Test complaints  : {n_eval}")
    print(f"Top-1 hit rate   : {top1_rate:.1%}")
    print(f"Top-{args.top_k} hit rate   : {topk_rate:.1%}")
    print(f"Mean distance error (Top-1 miss): {mean_dist:.0f} km")
    print()
    print("Per-typology most-likely zone (learned from TRAIN):")
    for ftype, ranked in ranked_zones_by_type.items():
        print(f"  {ftype:<18} -> {ranked[:args.top_k]}")


if __name__ == "__main__":
    main()
