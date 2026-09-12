import React, { useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, Button, AICard, SparkleIcon, FeatureTag, SectionLabel } from '../components/ui';

const trendData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  risk: Math.floor(Math.random() * 35) + 18 + (i > 11 ? 28 : 0),
}));

const fraudTypes = [
  { name: 'Investment Scam', value: 32, color: '#7C5CFC' },
  { name: 'UPI Fraud', value: 26, color: '#14B8A6' },
  { name: 'Impersonation', value: 18, color: '#F59E0B' },
  { name: 'Digital Arrest', value: 13, color: '#E5484D' },
  { name: 'Others', value: 11, color: '#94A3B8' },
];

// Hotspot data with accurate geographic positions
const hotspots = [
  { id: 'delhi', label: 'Delhi NCR', x: 212, y: 118, level: 'critical', score: 0.87, cases: 17, amount: '₹32.4L', window: '42–110 min' },
  { id: 'jaipur', label: 'Jaipur', x: 170, y: 141, level: 'high', score: 0.74, cases: 7, amount: '₹18.2L', window: '72–180 min' },
  { id: 'lucknow', label: 'Lucknow', x: 260, y: 133, level: 'high', score: 0.71, cases: 5, amount: '₹12.8L', window: '55–140 min' },
  { id: 'mumbai', label: 'Mumbai', x: 107, y: 238, level: 'medium', score: 0.55, cases: 4, amount: '₹8.6L', window: '120–240 min' },
  { id: 'kolkata', label: 'Kolkata', x: 328, y: 182, level: 'medium', score: 0.61, cases: 6, amount: '₹11.4L', window: '90–200 min' },
  { id: 'hyderabad', label: 'Hyderabad', x: 224, y: 290, level: 'low', score: 0.38, cases: 2, amount: '₹4.1L', window: '3–6 hrs' },
  { id: 'bengaluru', label: 'Bengaluru', x: 210, y: 342, level: 'low', score: 0.29, cases: 1, amount: '₹2.3L', window: '4–8 hrs' },
];

const hotspotColors: Record<string, string> = {
  critical: '#E5484D',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#14B8A6',
};

// India outline
const indiaMain = "M 130,30 L 162,8 L 198,4 L 236,6 L 270,15 L 298,30 L 320,48 L 344,60 L 374,78 L 388,104 L 386,130 L 374,157 L 358,184 L 342,212 L 328,240 L 314,267 L 300,292 L 286,317 L 272,344 L 257,370 L 242,396 L 230,420 L 220,442 L 212,460 L 206,470 L 200,460 L 186,438 L 171,412 L 155,384 L 140,352 L 126,318 L 112,284 L 100,252 L 88,220 L 76,194 L 60,187 L 46,197 L 44,218 L 54,240 L 70,260 L 84,274 L 97,287 L 102,274 L 95,252 L 90,230 L 92,212 L 100,195 L 112,180 L 114,157 L 117,132 L 114,107 L 116,83 L 120,62 L 124,44 Z";

// State boundary lines – creates GIS administrative divisions feel
const stateBoundaries = [
  // Rajasthan south / MP north boundary (horizontal-ish)
  "M 96,157 L 130,165 L 200,154 L 268,162 L 305,158",
  // UP-Bihar boundary
  "M 305,105 L 308,165",
  // Bihar-WB boundary
  "M 349,115 L 356,157 L 362,192",
  // Gujarat-Maharashtra (west coastal)
  "M 97,197 L 92,230 L 86,252",
  // Gujarat-Rajasthan
  "M 97,157 L 96,197",
  // Central India – MP south boundary
  "M 96,225 L 132,218 L 202,238 L 264,228 L 306,218",
  // Odisha west
  "M 306,218 L 330,218 L 366,202 L 375,242",
  // AP/Telangana west
  "M 204,272 L 238,283 L 318,275",
  // Karnataka south boundary / Deccan
  "M 90,308 L 128,318 L 168,313 L 204,308 L 240,300 L 282,296",
  // TN-Karnataka boundary
  "M 127,348 L 170,368 L 218,367 L 258,352",
  // Kerala strip
  "M 90,308 L 82,338 L 88,372",
  // NE states border
  "M 374,78 L 390,138",
  // Andhra-Odisha
  "M 374,245 L 358,275 L 320,308",
];

// Major cities (not hotspots) for geographic context
const cities = [
  { x: 107, y: 188, label: 'Ahmedabad' },
  { x: 130, y: 267, label: 'Pune' },
  { x: 218, y: 350, label: 'Chennai', offsetX: 8 },
  { x: 308, y: 348, label: 'Bhubaneswar', offsetX: 8 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-mono font-medium text-[#14B8A6]">{payload[0].payload.h}</div>
        <div className="text-[#0F172A]">High-risk cases: <strong>{payload[0].value}</strong></div>
      </div>
    );
  }
  return null;
};

export default function CommandCenter({ onOpenCase }: { onOpenCase?: () => void }) {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('delhi');
  const [mapMode, setMapMode] = useState<'live' | 'historical'>('live');
  const selected = hotspots.find(h => h.id === selectedHotspot);

  return (
    <div className="p-7 space-y-7">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Cyber Intelligence Command Center</h1>
          <p className="text-sm text-[#64748B] mt-1.5 max-w-xl leading-relaxed">
            Real-time predictive intelligence across fraud cases, financial networks, and cash-out hotspots.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#475569] px-3.5 py-2.5 focus:outline-none cursor-pointer shadow-sm">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
          <Button variant="primary" icon={<PlusIcon />}>New Investigation</Button>
        </div>
      </div>

      {/* Section 1: Core KPIs */}
      <section>
        <SectionLabel type="sih">Core Prediction Metrics</SectionLabel>
        <div className="grid grid-cols-5 gap-4">
          <MetricCard
            title="Active Fraud Cases"
            value="1,284"
            delta="+8.4% today"
            deltaPositive={false}
            iconColor="#E5484D"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7H11M5 10H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
          />
          <MetricCard
            title="Amount at Risk"
            value="₹18.6 Cr"
            delta="Across active cases"
            iconColor="#E5484D"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5.24 2 3 4.24 3 7C3 9.76 5.24 12 8 12C10.76 12 13 9.76 13 7" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5V7L9.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 2L13 4L15 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <MetricCard
            title="High-Risk Zones"
            value="27"
            delta="6 newly detected"
            deltaPositive={false}
            iconColor="#F97316"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 13L5.5 15.5M8 13L10.5 15.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
          />
          <MetricCard
            title="Preventive Alerts"
            value="143"
            delta="89 acknowledged"
            iconColor="#F59E0B"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
          />
          <MetricCard
            title="Model Accuracy"
            value="86.4%"
            delta="+2.7% vs prior period"
            deltaPositive
            iconColor="#7C5CFC"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11L5.5 7L8.5 9.5L12 4L14 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
        </div>
      </section>

      {/* Section 2: Map + Priority Interventions */}
      <section>
        <SectionLabel type="sih">Predictive Cash-Out Risk Map</SectionLabel>
        <div className="grid grid-cols-3 gap-5">

          {/* Map */}
          <Card className="col-span-2 overflow-hidden">
            {/* Map toolbar */}
            <div className="px-5 py-3.5 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {['Fraud Type', 'Risk Level', 'State', 'Bank', 'Time Window'].map(f => (
                  <select key={f} className="text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option>{f}</option>
                  </select>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] overflow-hidden">
                {(['live', 'historical'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMapMode(m)}
                    className={`px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${mapMode === m ? 'bg-[#14B8A6] text-white' : 'bg-white text-[#64748B]'}`}
                  >
                    {m === 'live' ? 'Live Risk' : 'Historical'}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Map */}
            <div className="relative p-4">
              <div className="rounded-2xl overflow-hidden relative" style={{ background: '#E8F0F8' }}>
                <svg viewBox="0 0 430 490" className="w-full" style={{ maxHeight: '340px', display: 'block' }}>
                  {/* Sea background already set via container */}

                  {/* State fills — subtle alternating zones */}
                  <path d="M 130,30 L 162,8 L 198,4 L 270,15 L 120,62 L 114,107 L 117,132 L 114,157 L 96,157 L 97,197 L 96,225 L 86,252 L 76,194 L 60,187 L 46,197 L 44,218 L 54,240 L 70,260 L 84,274 L 97,287 L 102,274 L 95,252 L 90,230 L 92,212 L 100,195 L 112,180 L 114,157 Z"
                    fill="#EBE8E0" stroke="none"/>
                  <path d="M 96,157 L 130,165 L 200,154 L 212,118 L 174,105 L 160,82 L 114,107 L 117,132 L 114,157 Z"
                    fill="#E4E0D8" stroke="none"/>
                  <path d="M 200,154 L 268,162 L 305,158 L 308,105 L 270,15 L 298,30 L 320,48 L 344,60 L 374,78 L 388,104 L 386,130 L 374,157 L 342,212 L 328,240 L 306,218 L 264,228 L 202,238 L 200,154 Z"
                    fill="#EBE8E0" stroke="none"/>
                  <path d="M 200,154 L 268,162 L 305,158 L 308,165 L 268,162 L 264,228 L 202,238 L 132,218 L 96,225 L 97,197 L 96,157 L 130,165 Z"
                    fill="#E7E4DC" stroke="none"/>
                  <path d="M 306,218 L 330,218 L 366,202 L 375,242 L 360,270 L 318,278 L 300,252 L 306,218 Z"
                    fill="#EBE8E0" stroke="none"/>
                  <path d="M 96,225 L 132,218 L 202,238 L 264,228 L 306,218 L 300,252 L 240,283 L 204,272 L 132,270 L 96,252 Z"
                    fill="#E4E0D8" stroke="none"/>
                  <path d="M 204,272 L 240,283 L 318,275 L 322,308 L 270,320 L 240,300 L 204,308 L 168,313 L 204,272 Z"
                    fill="#EBE8E0" stroke="none"/>
                  <path d="M 90,252 L 132,270 L 204,272 L 168,313 L 128,318 L 90,308 Z"
                    fill="#E7E4DC" stroke="none"/>
                  <path d="M 90,308 L 128,318 L 168,313 L 128,348 L 90,335 Z"
                    fill="#EBE8E0" stroke="none"/>
                  <path d="M 128,348 L 170,368 L 218,367 L 242,396 L 230,420 L 220,442 L 212,460 L 206,470 L 200,460 L 186,438 L 171,412 L 155,384 L 140,352 Z"
                    fill="#E4E0D8" stroke="none"/>
                  <path d="M 218,367 L 258,352 L 270,370 L 266,410 L 242,396 Z"
                    fill="#EBE8E0" stroke="none"/>

                  {/* Main India outline */}
                  <path d={indiaMain} fill="none" stroke="#94A3B8" strokeWidth="1.2"/>

                  {/* State boundaries */}
                  {stateBoundaries.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#B0BAC8" strokeWidth="0.65" strokeDasharray="none" opacity={0.8}/>
                  ))}

                  {/* Background city dots */}
                  {cities.map(city => (
                    <g key={city.label}>
                      <circle cx={city.x} cy={city.y} r={2} fill="#94A3B8" opacity={0.6}/>
                      <text x={city.x + (city.offsetX || -city.label.length * 2.8)} y={city.y - 5}
                        fill="#6B7280" fontSize="7.5" fontFamily="Inter, sans-serif" opacity={0.7}>
                        {city.label}
                      </text>
                    </g>
                  ))}

                  {/* Risk hotspot circles */}
                  {hotspots.map(h => {
                    const color = hotspotColors[h.level];
                    const isSelected = selectedHotspot === h.id;
                    return (
                      <g key={h.id} className="cursor-pointer" onClick={() => setSelectedHotspot(h.id === selectedHotspot ? null : h.id)}>
                        <circle cx={h.x} cy={h.y} r={isSelected ? 32 : 26} fill={color} opacity={0.07}/>
                        <circle cx={h.x} cy={h.y} r={isSelected ? 20 : 16} fill={color} opacity={0.12}/>
                        <circle cx={h.x} cy={h.y} r={isSelected ? 10 : 7.5} fill={color} opacity={isSelected ? 0.95 : 0.75}
                          stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 1.5 : 0}/>
                        <text x={h.x} y={h.y + (isSelected ? 24 : 21)}
                          textAnchor="middle" fill="#334155" fontSize="8.5"
                          fontFamily="Inter, sans-serif" fontWeight="500">
                          {h.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/92 backdrop-blur-sm rounded-xl px-3.5 py-3 border border-[#E2E8F0] shadow-sm text-xs space-y-1.5">
                  <div className="text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Risk Level</div>
                  {[
                    { label: 'Critical  80%+', color: '#E5484D' },
                    { label: 'High  60–80%', color: '#F97316' },
                    { label: 'Moderate  40–60%', color: '#F59E0B' },
                    { label: 'Low  < 40%', color: '#14B8A6' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }}/>
                      <span className="text-[#475569]">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Context popup */}
                {selected && (
                  <div className="absolute top-4 right-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4 w-56 fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] leading-tight">{selected.label}</div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">Active cluster</div>
                      </div>
                      <span className="text-sm font-bold font-mono" style={{ color: hotspotColors[selected.level] }}>
                        {Math.round(selected.score * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#F1F5F9] rounded-full mb-3 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.round(selected.score * 100)}%`, background: hotspotColors[selected.level] }}/>
                    </div>
                    <div className="space-y-1.5 text-xs mb-3">
                      {[
                        { k: 'Window', v: selected.window },
                        { k: 'Exposure', v: selected.amount },
                        { k: 'Linked cases', v: `${selected.cases}` },
                      ].map(r => (
                        <div key={r.k} className="flex items-center justify-between">
                          <span className="text-[#94A3B8]">{r.k}</span>
                          <span className="font-semibold text-[#0F172A] font-mono">{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={onOpenCase}
                      className="w-full py-2 text-xs font-semibold text-white rounded-xl hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(90deg, #14B8A6, #0D9488)' }}
                    >
                      Open Intelligence View
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Priority Interventions */}
          <Card className="flex flex-col">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-[#0F172A]">Priority Interventions</span>
                <FeatureTag type="sih" />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Sorted by cash-out probability</p>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {[
                { id: 'NCRP-26-81942', amount: '₹4.8L', zone: 'Gurugram', prob: 91, level: 'critical', mins: 56 },
                { id: 'NCRP-26-81773', amount: '₹2.2L', zone: 'Noida', prob: 84, level: 'high', mins: 38 },
                { id: 'NCRP-26-81895', amount: '₹7.1L', zone: 'Jaipur', prob: 79, level: 'high', mins: 72 },
                { id: 'NCRP-26-81831', amount: '₹1.6L', zone: 'Lucknow', prob: 67, level: 'medium', mins: 95 },
              ].map(c => (
                <div
                  key={c.id}
                  onClick={onOpenCase}
                  className="p-3.5 rounded-xl border cursor-pointer hover:border-[#14B8A6]/30 hover:bg-[#F7FFFE] transition-all group"
                  style={{ borderColor: c.level === 'critical' ? 'rgba(229,72,77,0.2)' : '#E8ECF0' }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#0F172A] group-hover:text-[#14B8A6] transition-colors">{c.id}</span>
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${c.level === 'critical' ? 'risk-critical' : c.level === 'high' ? 'risk-high' : 'risk-medium'}`}>
                      {c.prob}%
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B]">{c.amount} · {c.zone}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#94A3B8" strokeWidth="1.1"/><path d="M5 2.5V5L6.5 6.5" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/></svg>
                    <span className="text-[10px] text-[#94A3B8]">Window: {c.mins} min</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[#F1F5F9]">
              <button className="w-full py-2 text-sm font-medium text-[#14B8A6] border border-[#14B8A6]/20 rounded-xl hover:bg-[#14B8A6]/5 transition-colors">
                View All Alerts
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Section 3: Analytics + AI Summary */}
      <section>
        <SectionLabel type="usp">Intelligence Layer</SectionLabel>
        <div className="grid grid-cols-3 gap-5">

          {/* Fraud Type */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-semibold text-[#0F172A]">Fraud Type Distribution</div>
                <div className="text-xs text-[#94A3B8] mt-1">Last 24 hours · 1,284 cases</div>
              </div>
              <FeatureTag type="sih" />
            </div>
            <div className="flex items-center gap-5">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={fraudTypes} cx={50} cy={50} innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                    {fraudTypes.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {fraudTypes.map(f => (
                  <div key={f.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }}/>
                    <span className="text-xs text-[#475569] flex-1">{f.name}</span>
                    <span className="text-xs font-semibold text-[#0F172A] font-mono">{f.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Risk Trend */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-semibold text-[#0F172A]">Cash-Out Risk Trend</div>
                <div className="text-xs text-[#94A3B8] mt-1">Hourly predicted cases · Last 24h</div>
              </div>
              <FeatureTag type="sih" />
            </div>
            <ResponsiveContainer width="100%" height={115}>
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={5}/>
                <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="risk" stroke="#14B8A6" strokeWidth={2} fill="url(#riskGrad)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Intelligence Summary */}
          <div className="rounded-2xl overflow-hidden border border-[#7C5CFC]/18">
            <div className="ai-gradient px-5 py-4 flex items-center gap-3">
              <SparkleIcon size={18}/>
              <div>
                <div className="text-white font-semibold">TRINETRA Intelligence</div>
                <div className="text-white/65 text-[11px] mt-0.5">AI-generated summary · Updated 4 min ago</div>
              </div>
              <div className="ml-auto">
                <FeatureTag type="usp" />
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-[#7C5CFC]/6 to-[#4338CA]/3">
              <div className="space-y-3">
                {[
                  { icon: '🔴', text: '18 emerging withdrawal clusters detected in the last 6 hours across NCR and Rajasthan.' },
                  { icon: '⚡', text: 'Delhi NCR and Jaipur show unusually high convergence between mule-account activity and ATM cash-out patterns.' },
                  { icon: '📡', text: '3 OSINT signals corroborate elevated fraud activity in Gurugram Sector 29.' },
                ].map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#3D2FA8]">
                    <span className="text-base leading-snug flex-shrink-0">{insight.icon}</span>
                    <p className="leading-relaxed text-xs">{insight.text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={onOpenCase}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white w-full justify-center transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}
              >
                <SparkleIcon size={12}/>
                Ask Copilot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Legend */}
      <section>
        <Card className="p-5">
          <div className="flex items-center gap-8">
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Platform Capabilities</div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2.5">
                <FeatureTag type="sih" />
                <span className="text-xs text-[#475569]">Predictive analytics, GIS hotspot mapping, case management, LEA alerts, model intelligence</span>
              </div>
              <div className="h-4 w-px bg-[#E2E8F0]"/>
              <div className="flex items-center gap-2.5">
                <FeatureTag type="usp" />
                <span className="text-xs text-[#475569]">OSINT verification, explainable AI, fraud graph, AI Copilot, evidence-grounded intelligence</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}

// ─── Local MetricCard ─────────────────────────────────────────────────────────

function MetricCard({ title, value, delta, deltaPositive, icon, iconColor }: {
  title: string; value: string; delta?: string; deltaPositive?: boolean; icon: React.ReactNode; iconColor: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}12`, color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="text-[28px] font-bold text-[#0F172A] leading-none mb-1.5">{value}</div>
      <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide mb-2">{title}</div>
      {delta && (
        <div className={`text-xs font-medium flex items-center gap-1 ${deltaPositive ? 'text-emerald-600' : 'text-[#94A3B8]'}`}>
          {deltaPositive && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 7L5 2.5L8 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {delta}
        </div>
      )}
    </Card>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
