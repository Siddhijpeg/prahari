// Converts a confidence % + amount + time-window into a single ₹ figure:
// "how much money is actually recoverable if someone acts on this alert right now."
// Confidence alone doesn't capture urgency — a 90%-confident alert with 5 minutes
// left is worth less action than an 80%-confident one with an hour left.

export function parseAmount(amountStr: string): number {
  const clean = amountStr.replace('₹', '').replace(/,/g, '').trim();
  if (clean.toLowerCase().endsWith('cr')) return parseFloat(clean) * 1e7;
  if (clean.toLowerCase().endsWith('l') || clean.toLowerCase().endsWith('lakh')) {
    return parseFloat(clean) * 1e5;
  }
  return parseFloat(clean) || 0;
}

export function formatCompactINR(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

// Pulls the smaller number out of a "46–110 minutes" style window string —
// that's the minutes left before the earliest likely cash-out.
export function parseWindowMinMinutes(window: string): number {
  const match = window.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
}

// Chance that an alert raised right now still arrives in time to matter.
// More minutes left -> higher chance of a successful intervention, capped at 95%.
export function recoveryFactor(minMinutes: number): number {
  return Math.min(0.95, 0.25 + minMinutes / 200);
}

export interface InterventionValueInput {
  confidence: number;   // 0-100
  amount: string;       // e.g. "₹4.8L"
  window: string;        // e.g. "46–110 minutes"
}

export function interventionValue({ confidence, amount, window }: InterventionValueInput): number {
  const amt = parseAmount(amount);
  const minMin = parseWindowMinMinutes(window);
  const factor = recoveryFactor(minMin);
  return (confidence / 100) * amt * factor;
}
