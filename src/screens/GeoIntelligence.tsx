import React, { useState } from 'react';
import { Card, Button, FeatureTag, SectionLabel } from '../components/ui';

// Shared India map constants
const indiaMain = "M 130,30 L 162,8 L 198,4 L 236,6 L 270,15 L 298,30 L 320,48 L 344,60 L 374,78 L 388,104 L 386,130 L 374,157 L 358,184 L 342,212 L 328,240 L 314,267 L 300,292 L 286,317 L 272,344 L 257,370 L 242,396 L 230,420 L 220,442 L 212,460 L 206,470 L 200,460 L 186,438 L 171,412 L 155,384 L 140,352 L 126,318 L 112,284 L 100,252 L 88,220 L 76,194 L 60,187 L 46,197 L 44,218 L 54,240 L 70,260 L 84,274 L 97,287 L 102,274 L 95,252 L 90,230 L 92,212 L 100,195 L 112,180 L 114,157 L 117,132 L 114,107 L 116,83 L 120,62 L 124,44 Z";

const stateBoundaries = [
  "M 96,157 L 130,165 L 200,154 L 268,162 L 305,158",
  "M 305,105 L 308,165",
  "M 349,115 L 356,157 L 362,192",
  "M 97,197 L 92,230 L 86,252",
  "M 97,157 L 96,197",
  "M 96,225 L 132,218 L 202,238 L 264,228 L 306,218",
  "M 306,218 L 330,218 L 366,202 L 375,242",
  "M 204,272 L 238,283 L 318,275",
  "M 90,308 L 128,318 L 168,313 L 204,308 L 240,300 L 282,296",
  "M 127,348 L 170,368 L 218,367 L 258,352",
  "M 90,308 L 82,338 L 88,372",
  "M 374,78 L 390,138",
  "M 374,245 L 358,275 L 320,308",
];

const stateFills = [
  // NW states (Rajasthan, Gujarat area)
  { d: "M 130,30 L 162,8 L 198,4 L 270,15 L 120,62 L 114,107 L 117,132 L 114,157 L 96,157 L 97,197 L 96,225 L 86,252 L 76,194 L 60,187 L 46,197 L 44,218 L 54,240 L 70,260 L 84,274 L 97,287 L 102,274 L 95,252 L 90,230 L 92,212 L 100,195 L 112,180 L 114,157 Z", fill: "#EBE8E0" },
  // N states (Punjab/Haryana/UP area)
  { d: "M 96,157 L 130,165 L 200,154 L 212,118 L 174,105 L 160,82 L 114,107 L 117,132 L 114,157 Z", fill: "#E6E2D8" },
  // NE and east (UP, Bihar, WB, NE)
  { d: "M 200,154 L 268,162 L 305,158 L 308,105 L 270,15 L 298,30 L 320,48 L 344,60 L 374,78 L 388,104 L 386,130 L 374,157 L 342,212 L 328,240 L 306,218 L 264,228 L 202,238 L 200,154 Z", fill: "#ECE9E1" },
  // Central (MP / Chhattisgarh)
  { d: "M 96,225 L 132,218 L 202,238 L 264,228 L 306,218 L 300,252 L 240,283 L 204,272 L 132,270 L 96,252 Z", fill: "#E5E1D9" },
  // East coast (Odisha)
  { d: "M 306,218 L 330,218 L 366,202 L 375,242 L 360,270 L 318,278 L 300,252 Z", fill: "#EBE8E0" },
  // Maharashtra / Goa
  { d: "M 90,252 L 132,270 L 204,272 L 168,313 L 128,318 L 90,308 Z", fill: "#E7E4DC" },
  // AP / Telangana
  { d: "M 204,272 L 240,283 L 318,275 L 322,308 L 270,320 L 240,300 L 204,308 L 168,313 Z", fill: "#EDEAE2" },
  // Karnataka
  { d: "M 90,308 L 128,318 L 168,313 L 128,348 L 90,335 Z", fill: "#E4E0D8" },
  // Kerala
  { d: "M 86,335 L 90,308 L 82,338 L 82,375 L 88,372 Z", fill: "#EBE8E0" },
  // TN
  { d: "M 128,348 L 170,368 L 218,367 L 242,396 L 230,420 L 220,442 L 212,460 L 206,470 L 200,460 L 186,438 L 171,412 L 155,384 L 140,352 Z", fill: "#E6E2D8" },
  // Andhra coast + rest
  { d: "M 218,367 L 258,352 L 270,370 L 266,410 L 242,396 Z", fill: "#EBE8E0" },
];

// Cities for geographic context
const contextCities = [
  { x: 212, y: 118, label: 'New Delhi', anchor: 'start', dx: 8, dy: -4 },
  { x: 107, y: 238, label: 'Mumbai', anchor: 'end', dx: -8, dy: -5 },
  { x: 328, y: 182, label: 'Kolkata', anchor: 'start', dx: 8, dy: -4 },
  { x: 224, y: 290, label: 'Hyderabad', anchor: 'start', dx: 8, dy: -3 },
  { x: 210, y: 342, label: 'Bengaluru', anchor: 'end', dx: -8, dy: -3 },
  { x: 218, y: 350, label: 'Chennai', anchor: 'start', dx: 8, dy: 12 },
  { x: 107, y: 188, label: 'Ahmedabad', anchor: 'end', dx: -8, dy: -3 },
  { x: 170, y: 141, label: 'Jaipur', anchor: 'end', dx: -8, dy: -3 },
  { x: 260, y: 133, label: 'Lucknow', anchor: 'start', dx: 8, dy: -3 },
];

const zones = [
  { id: 'gurugram', label: 'Gurugram Sector 29', state: 'Haryana', x: 205, y: 120, risk: 92, cases: 13, color: '#E5484D', r: 22 },
  { id: 'noida', label: 'Noida Sector 18', state: 'UP', x: 218, y: 112, risk: 86, cases: 9, color: '#F97316', r: 18 },
  { id: 'jaipur', label: 'Jaipur Central', state: 'Rajasthan', x: 170, y: 141, risk: 81, cases: 7, color: '#F97316', r: 16 },
  { id: 'lucknow', label: 'Lucknow Hazratganj', state: 'UP', x: 260, y: 133, risk: 67, cases: 5, color: '#F59E0B', r: 14 },
  { id: 'mumbai', label: 'Mumbai Andheri', state: 'Maharashtra', x: 107, y: 238, risk: 54, cases: 4, color: '#F59E0B', r: 12 },
  { id: 'kolkata', label: 'Kolkata Park Street', state: 'West Bengal', x: 328, y: 182, risk: 43, cases: 3, color: '#14B8A6', r: 10 },
  { id: 'bengaluru', label: 'Bengaluru Whitefield', state: 'Karnataka', x: 210, y: 342, risk: 31, cases: 2, color: '#14B8A6', r: 9 },
];

const layers = [
  { id: 'hotspots', label: 'Predicted Hotspots', defaultOn: true },
  { id: 'atms', label: 'ATM Locations', defaultOn: true },
  { id: 'withdrawals', label: 'Historical Withdrawals', defaultOn: true },
  { id: 'cases', label: 'Active Cases', defaultOn: true },
  { id: 'mules', label: 'Mule Account Locations', defaultOn: true },
  { id: 'branches', label: 'Bank Branches', defaultOn: false },
  { id: 'osint', label: 'OSINT Signals', defaultOn: false },
];

const horizons = ['30 min', '1 hour', '2 hours', '6 hours', '24 hours'];

export default function GeoIntelligence() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(layers.map(l => [l.id, l.defaultOn]))
  );
  const [horizon, setHorizon] = useState('1 hour');
  const [selectedZone, setSelectedZone] = useState<string | null>('gurugram');
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const toggleLayer = (id: string) => setActiveLayers(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="p-7 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Geospatial Cash-Out Intelligence</h1>
            <FeatureTag type="sih" />
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-xl">
            Predictive risk mapping across ATM clusters, withdrawal hotspots, and mule-account locations.
            <span className="text-[#94A3B8] ml-2">Prototype-level map data.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Export Map</Button>
          <Button variant="primary" size="sm">Full Screen</Button>
        </div>
      </div>

      {/* 4-col layout */}
      <div className="flex-1 grid grid-cols-5 gap-5 min-h-0">

        {/* Left panel */}
        <div className="col-span-1 space-y-4 overflow-y-auto">
          {/* Layer Controls */}
          <Card className="p-4">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Map Layers</div>
            <div className="space-y-2.5">
              {layers.map(layer => (
                <label key={layer.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                      activeLayers[layer.id] ? 'bg-[#14B8A6] border-[#14B8A6]' : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {activeLayers[layer.id] && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                  <span className={`text-xs leading-relaxed transition-colors ${activeLayers[layer.id] ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                    {layer.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Prediction Horizon */}
          <Card className="p-4">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Horizon</div>
            <div className="space-y-1">
              {horizons.map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    horizon === h ? 'bg-[#14B8A6] text-white' : 'text-[#64748B] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-4 space-y-3">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Filters</div>
            {['Risk Threshold', 'Fraud Type', 'Financial Institution'].map(f => (
              <div key={f}>
                <label className="text-[10px] text-[#94A3B8] mb-1 block">{f}</label>
                <select className="w-full text-xs border border-[#E2E8F0] rounded-lg bg-[#F7F8FA] text-[#64748B] px-2.5 py-2 focus:outline-none cursor-pointer">
                  <option>All</option>
                </select>
              </div>
            ))}
          </Card>
        </div>

        {/* Map */}
        <div className="col-span-3 rounded-2xl overflow-hidden border border-[#E2E8F0] relative flex flex-col" style={{ background: '#E4EEF6' }}>

          {/* Map header */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-[#E2E8F0] shadow-sm">
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Prediction Horizon</div>
            <div className="text-sm font-bold text-[#14B8A6]">{horizon}</div>
          </div>

          {/* SVG Map */}
          <svg viewBox="0 0 430 490" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
            {/* State fills */}
            {stateFills.map((s, i) => (
              <path key={i} d={s.d} fill={s.fill} stroke="none"/>
            ))}

            {/* State boundaries */}
            {stateBoundaries.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#B8C0CC" strokeWidth="0.7" opacity={0.85}/>
            ))}

            {/* India outline */}
            <path d={indiaMain} fill="none" stroke="#8A94A4" strokeWidth="1.3"/>

            {/* Context city dots */}
            {contextCities.map(city => (
              <g key={city.label}>
                <circle cx={city.x} cy={city.y} r={2.2} fill="#64748B" opacity={0.5}/>
                <text
                  x={city.x + city.dx} y={city.y + city.dy}
                  textAnchor={city.anchor as any}
                  fill="#475569" fontSize="8" fontFamily="Inter, sans-serif" opacity={0.65}
                >
                  {city.label}
                </text>
              </g>
            ))}

            {/* Hotspot zones */}
            {zones.map(zone => (
              <g
                key={zone.id}
                className="cursor-pointer"
                onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
              >
                {/* Halo rings */}
                <circle cx={zone.x} cy={zone.y} r={zone.r + 14} fill={zone.color} opacity={0.05}/>
                <circle cx={zone.x} cy={zone.y} r={zone.r + 5} fill={zone.color} opacity={0.09}/>
                {/* Core marker */}
                <circle
                  cx={zone.x} cy={zone.y}
                  r={selectedZone === zone.id ? zone.r * 0.7 + 2 : zone.r * 0.55}
                  fill={zone.color}
                  opacity={selectedZone === zone.id ? 0.92 : 0.72}
                  stroke={selectedZone === zone.id ? 'white' : 'none'}
                  strokeWidth={selectedZone === zone.id ? 2 : 0}
                />
                {/* Inner white dot */}
                <circle cx={zone.x} cy={zone.y} r={2.5} fill="white" opacity={0.85} className="pointer-events-none"/>
                {/* Label */}
                <text x={zone.x} y={zone.y + zone.r * 0.55 + 14}
                  textAnchor="middle" fill="#334155" fontSize="8.5"
                  fontFamily="Inter, sans-serif" fontWeight="500">
                  {zone.label.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/92 backdrop-blur-sm rounded-xl px-3.5 py-3 border border-[#E2E8F0] shadow-sm z-10">
            <div className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wide mb-2">Risk Level</div>
            {[
              { label: 'Critical  80%+', color: '#E5484D' },
              { label: 'High  60–80%', color: '#F97316' },
              { label: 'Moderate  40–60%', color: '#F59E0B' },
              { label: 'Low  < 40%', color: '#14B8A6' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }}/>
                <span className="text-[10px] text-[#475569]">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Selected zone popup */}
          {selectedZone && (() => {
            const z = zones.find(z => z.id === selectedZone)!;
            return (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl px-5 py-4 w-68 fade-in z-10" style={{ width: '260px' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">{z.label}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">{z.state} · Active prediction zone</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono" style={{ color: z.color }}>{z.risk}%</div>
                    <div className="text-[9px] text-[#94A3B8]">risk score</div>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{ width: `${z.risk}%`, background: z.color }}/>
                </div>
                <div className="text-xs text-[#64748B] mb-3">{z.cases} active linked cases</div>
                <button className="w-full py-2 text-xs font-semibold text-white rounded-xl hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg, #14B8A6, #0D9488)' }}>
                  Open Zone Intelligence
                </button>
              </div>
            );
          })()}

          {/* Scale bar */}
          <div className="absolute bottom-4 right-4 bg-white/80 rounded-lg px-2.5 py-1.5 border border-[#E2E8F0] z-10">
            <div className="flex items-center gap-1">
              <div className="w-8 h-px bg-[#64748B]"/>
              <span className="text-[9px] text-[#64748B]">~500 km</span>
            </div>
            <div className="text-[8px] text-[#94A3B8] mt-0.5">Prototype map</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-span-1 space-y-4 overflow-y-auto">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-[#0F172A]">Top Predicted Zones</div>
              <FeatureTag type="sih" />
            </div>
            <div className="space-y-3">
              {zones.slice(0, 5).map((zone, i) => (
                <div key={zone.id}>
                  <div
                    onClick={() => setSelectedZone(zone.id)}
                    className="cursor-pointer p-3 rounded-xl border transition-all hover:border-[#14B8A6]/30"
                    style={{
                      borderColor: selectedZone === zone.id ? zone.color + '45' : '#E8ECF0',
                      background: selectedZone === zone.id ? zone.color + '06' : 'white',
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#94A3B8] border border-[#E2E8F0] bg-[#F7F8FA] flex-shrink-0 mt-0.5">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] leading-tight">{zone.label}</div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{zone.state} · {zone.cases} cases</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${zone.risk}%`, background: zone.color }}/>
                          </div>
                          <span className="font-mono text-[10px] font-bold" style={{ color: zone.color }}>{zone.risk}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                    className="mt-1 ml-7 text-[10px] text-[#14B8A6] hover:underline"
                  >
                    {expandedZone === zone.id ? '▲ Less' : '▼ Why this area?'}
                  </button>
                  {expandedZone === zone.id && (
                    <div className="mt-1 ml-7 p-2.5 bg-[#F7F8FA] rounded-xl text-xs text-[#64748B] fade-in leading-relaxed">
                      High convergence of mule account activity, ATM clustering, and historical withdrawal patterns in this sub-district.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
