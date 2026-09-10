import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ScatterChart, Scatter, ReferenceLine,
} from 'recharts';
import { Card, RiskBadge } from '../components/ui';

const accuracyData = Array.from({ length: 14 }, (_, i) => ({
  date: `Sep ${i + 1}`,
  predicted: Math.floor(Math.random() * 10) + 80,
  actual: Math.floor(Math.random() * 10) + 78,
}));

const calibrationData = Array.from({ length: 10 }, (_, i) => ({
  predicted: (i + 1) * 10,
  actual: (i + 1) * 10 + (Math.random() - 0.5) * 12,
}));

const recentPredictions = [
  { case: 'NCRP-26-81942', region: 'Gurugram Sector 29', outcome: 'Intervention', confidence: 91, error: '0.8 km', status: 'correct' },
  { case: 'NCRP-26-81911', region: 'Jaipur Central', outcome: 'Pending', confidence: 86, error: '—', status: 'pending' },
  { case: 'NCRP-26-81784', region: 'Noida Sector 62', outcome: 'Confirmed', confidence: 79, error: '1.2 km', status: 'correct' },
  { case: 'NCRP-26-81631', region: 'Mumbai Andheri', outcome: 'Missed', confidence: 54, error: '4.6 km', status: 'miss' },
  { case: 'NCRP-26-81540', region: 'Chennai T. Nagar', outcome: 'Confirmed', confidence: 71, error: '2.1 km', status: 'correct' },
  { case: 'NCRP-26-81498', region: 'Bengaluru Whitefield', outcome: 'Confirmed', confidence: 68, error: '3.4 km', status: 'correct' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 shadow-lg text-xs space-y-1">
        <div className="font-medium text-[#64748B]">{payload[0].payload.date}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: <strong>{p.value}%</strong></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PredictionEngine() {
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Prediction Engine</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Model performance monitoring and prediction audit trail.</p>
      </div>

      {/* Model Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16L8 10.5L12 13.5L17 6L20 9" stroke="#7C5CFC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 4L20 7L17 10" stroke="#7C5CFC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="font-bold text-[#0F172A] text-lg">TRINETRA Cash-Out Predictor v1.4</div>
              <div className="text-sm text-[#64748B] mt-0.5">Ensemble model · GBM + Neural Network · Last retrained: 4 Sep 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              Operational
            </div>
            <button className="text-xs font-medium text-[#14B8A6] border border-[#14B8A6]/20 px-3 py-1.5 rounded-lg hover:bg-[#14B8A6]/5 transition-colors">
              Retrain
            </button>
          </div>
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Prediction Accuracy', value: '86.4%', trend: '+2.7%', color: '#7C5CFC' },
          { label: 'Top-3 Zone Recall', value: '91.7%', trend: '+1.2%', color: '#14B8A6' },
          { label: 'Median Distance Error', value: '3.8 km', trend: '−0.4 km', color: '#14B8A6' },
          { label: 'False Alert Rate', value: '8.2%', trend: '−0.9%', color: '#10B981' },
          { label: 'Prediction Latency', value: '420 ms', trend: '−35ms', color: '#10B981' },
        ].map(m => (
          <Card key={m.label} className="p-4">
            <div className="text-xs text-[#64748B] font-medium mb-2">{m.label}</div>
            <div className="text-2xl font-bold text-[#0F172A]" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">{m.trend}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Accuracy over time */}
        <Card className="p-5">
          <div className="font-semibold text-[#0F172A] mb-1">Prediction vs Actual — Zone Accuracy</div>
          <div className="text-xs text-[#64748B] mb-4">Last 14 days · % correct zone predictions</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={accuracyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[70, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="predicted" name="Predicted %" stroke="#7C5CFC" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual %" stroke="#14B8A6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Calibration */}
        <Card className="p-5">
          <div className="font-semibold text-[#0F172A] mb-1">Risk Calibration Chart</div>
          <div className="text-xs text-[#64748B] mb-4">Predicted vs actual cash-out probability · Points near diagonal = well-calibrated</div>
          <ResponsiveContainer width="100%" height={160}>
            <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" />
              <XAxis dataKey="predicted" name="Predicted" tick={{ fontSize: 9, fill: '#94A3B8' }} label={{ value: 'Predicted %', fontSize: 9, fill: '#94A3B8', position: 'insideBottom', offset: -2 }} />
              <YAxis dataKey="actual" name="Actual" tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: '11px' }} />
              <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#CBD5E1" strokeDasharray="4 2" label={{ value: 'Perfect calibration', fontSize: 9, fill: '#94A3B8' }} />
              <Scatter data={calibrationData} fill="#14B8A6" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Model Health + Recent Predictions */}
      <div className="grid grid-cols-4 gap-4">
        {/* Model Health */}
        <Card className="p-4 space-y-2">
          <div className="font-semibold text-[#0F172A] text-sm mb-2">Model Health</div>
          {[
            { label: 'Model Drift', value: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Data Drift', value: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Feature Health', value: '11/12 OK', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Data Pipeline', value: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Last Retrained', value: '4 Sep 2026', color: 'text-[#64748B]', bg: 'bg-[#F7F8FA] border-[#E2E8F0]' },
          ].map(h => (
            <div key={h.label} className="flex items-center justify-between">
              <span className="text-xs text-[#64748B]">{h.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${h.color} ${h.bg}`}>{h.value}</span>
            </div>
          ))}
        </Card>

        {/* Recent Predictions Table */}
        <div className="col-span-3">
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2E8F0] font-semibold text-[#0F172A] text-sm">Recent Predictions</div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {['Case', 'Predicted Region', 'Outcome', 'Confidence', 'Distance Error'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((p, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F7FFFE] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0F172A]">{p.case}</td>
                    <td className="px-4 py-3 text-xs text-[#0F172A]">{p.region}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${
                        p.status === 'correct' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        p.status === 'miss' ? 'bg-red-50 border-red-200 text-red-600' :
                        'bg-[#F7F8FA] border-[#E2E8F0] text-[#64748B]'
                      }`}>{p.outcome}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C5CFC]" style={{ width: `${p.confidence}%` }} />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#0F172A]">{p.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{p.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
