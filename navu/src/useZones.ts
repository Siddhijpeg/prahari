import { useState } from 'react';

export interface Zone {
  id: string;
  name: string;
  prob: number;          // raw P(cash-out here)
  windowLeftMin: number;  // minutes before typical cash-out window closes
  recoveryProb: number;   // chance an alert sent now still stops it in time
  covered: boolean;
}

export interface ComputedZone extends Zone {
  normProb: number;
  value: number;
}

const initialZones: Zone[] = [
  { id: 'A', name: 'Zone A — Dwarka Sector 12', prob: 0.58, windowLeftMin: 6, recoveryProb: 0.22, covered: false },
  { id: 'B', name: 'Zone B — Rohini', prob: 0.27, windowLeftMin: 35, recoveryProb: 0.80, covered: false },
  { id: 'C', name: 'Zone C — Noida Sector 62', prob: 0.15, windowLeftMin: 70, recoveryProb: 0.92, covered: false },
];

export const AMOUNT_REMAINING = 81200;

export function currency(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function useZones() {
  const [zones, setZones] = useState<Zone[]>(initialZones);

  function computeValues(): ComputedZone[] {
    const active = zones.filter((z) => !z.covered);
    const totalProb = active.reduce((s, z) => s + z.prob, 0) || 1;
    return zones.map((z) => {
      const normProb = z.covered ? 0 : z.prob / totalProb;
      const value = normProb * AMOUNT_REMAINING * z.recoveryProb;
      return { ...z, normProb, value };
    });
  }

  function coverZone(id: string) {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, covered: true } : z)));
  }

  return { zones, computeValues, coverZone };
}
