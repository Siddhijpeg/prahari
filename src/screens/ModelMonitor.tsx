import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Card, SectionHeader, KPICard } from '../components/ui';

// Every alert outcome that comes back (frozen / recovered / missed) gets logged here.
// That log is what feeds the "periodic recalibration" — this is the piece that turns
// a static model into the "framework" the problem statement actually asks for.
const outcomeLog = [
  { alert: 'ALT-2026-081942', predictedZone: 'Gurugram Sector 29', outcome: 'Funds frozen', minutesToOutcome: 34, fedBack: true },
  { alert: 'ALT-2026-081911', predictedZone: 'Jaipur Central Market', outcome: 'Pending', minutesToOutcome: null, fedBack: false },
  { alert: 'ALT-2026-081784', predictedZone: 'Noida Sector 62', outcome: 'Recovered (partial)', minutesToOutcome: 58, fedBack: true },
  { alert: 'ALT-2026-081631', predictedZone: 'Mumbai Andheri', outcome: 'Missed — cashed out', minutesToOutcome: 71, fedBack: true },
  { alert: 'ALT-2026-081540', predictedZone: 'Chennai T. Nagar', outcome: 'Funds frozen', minutesToOutcome: 22, fedBack: true },
];

const outcomeStyle: Record<string, string> = {
  'Funds frozen': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'Recovered (partial)': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'Pending': 'bg-[#F7F8FA] border-[#E2E8F0] text-[#64748B]',
  'Missed — cashed out': 'bg-red-50 border-red-200 text-red-700',
};

// Rolling accuracy since the last recalibration — this is what tells you a
// recalibration is starting to be worth doing again, rather than guessing on a timer.
const driftData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  accuracy: Math.round(88 - i * 1.1 + (Math.random() - 0.5) * 3),
}));

export default function ModelMonitor() {
  const [recalibrating, setRecalibrating] = useState(false);
  const [lastRecalibrated, setLastRecalibrated] = useState('4 Sep 2026');

  const pendingOutcomes = outcomeLog.filter(o => !o.fedBack && o.outcome !== 'Pending').length;
  const loggedOutcomes = outcomeLog.filter(o => o.fedBack).length;
  const currentAccuracy = driftData[driftData.length - 1].accuracy;
  const driftThreshold = 80;
  const isDrifting = currentAccuracy < driftThreshold;

  function runRecalibration() {
    setRecalibrating(true);
    setTimeout(() => {
      setRecalibrating(false);
      setLastRecalibrated(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
    }, 1400);
  }

  return (
    <div className="p-6 space-y-5">
      <SectionHeader
        title="Model Monitor"
        subtitle="Outcome feedback loop and drift monitoring — the model learns from what actually happened to each alert."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Current Accuracy" value={`${currentAccuracy}%`} sub={`vs ${driftThreshold}% recalibration threshold`} accentColor={isDrifting ? '#E5484D' : '#14B8A6'} />
        <KPICard title="Outcomes Logged" value={String(loggedOutcomes)} sub={`of ${outcomeLog.length} tracked alerts`} accentColor="#7C5CFC" />
        <KPICard title="Awaiting Feedback" value={String(pendingOutcomes)} sub="outcomes not yet resolved" accentColor="#F59E0B" />
        <KPICard title="Last Recalibrated" value={lastRecalibrated} sub="registry + estimator priors" accentColor="#14B8A6" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Drift chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-[#0F172A] text-sm">Accuracy Since Last Recalibration</div>
              <div className="text-xs text-[#64748B] mt-0.5">Weekly rolling accuracy on resolved outcomes</div>
            </div>
            {isDrifting && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                Drift detected — recalibration recommended
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={driftData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 95]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <ReferenceLine y={driftThreshold} stroke="#E5484D" strokeDasharray="4 4" label={{ value: 'threshold', fontSize: 10, fill: '#E5484D' }} />
              <Line type="monotone" dataKey="accuracy" stroke="#7C5CFC" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>

          <button
            onClick={runRecalibration}
            disabled={recalibrating}
            className={`mt-2 w-full py-2.5 text-sm font-semibold rounded-xl transition-colors ${
              recalibrating
                ? 'bg-[#7C5CFC]/40 text-white cursor-wait'
                : 'bg-[#7C5CFC] text-white hover:bg-[#6D4FF5]'
            }`}
          >
            {recalibrating ? 'Recalibrating registry & estimator priors…' : 'Run recalibration now'}
          </button>
        </Card>

        {/* Outcome feedback log */}
        <Card className="p-5">
          <div className="font-semibold text-[#0F172A] text-sm mb-1">Outcome Feedback Log</div>
          <div className="text-xs text-[#64748B] mb-3">What actually happened to each alert, fed back into the model.</div>
          <div className="space-y-2.5">
            {outcomeLog.map(o => (
              <div key={o.alert} className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#64748B]">{o.alert}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${outcomeStyle[o.outcome]}`}>
                    {o.outcome}
                  </span>
                </div>
                <div className="text-xs text-[#0F172A] font-medium mt-1">{o.predictedZone}</div>
                {o.minutesToOutcome !== null && (
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">Resolved in {o.minutesToOutcome} min · fed to registry</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
