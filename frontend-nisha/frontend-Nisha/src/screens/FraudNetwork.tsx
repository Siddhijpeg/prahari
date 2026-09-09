import React, { useState } from 'react';
import { Card, RiskBadge, Button, AICard, SparkleIcon, FeatureTag, SectionLabel } from '../components/ui';

type NodeType = 'victim' | 'account' | 'mule' | 'upi' | 'atm' | 'phone' | 'cluster';

type NodeData = {
  id: string;
  label: string;
  sub?: string;
  type: NodeType;
  x: number;
  y: number;
  risk?: 'critical' | 'high';
};

const nodeColors: Record<NodeType, { fill: string; stroke: string; text: string }> = {
  victim: { fill: '#EFF6FF', stroke: '#3B82F6', text: '#1D4ED8' },
  account: { fill: '#F0FDF4', stroke: '#22C55E', text: '#15803D' },
  mule: { fill: '#FFF7ED', stroke: '#F97316', text: '#C2410C' },
  upi: { fill: '#FAF5FF', stroke: '#A855F7', text: '#7E22CE' },
  atm: { fill: '#FFF1F1', stroke: '#E5484D', text: '#B91C1C' },
  phone: { fill: '#F8FAFC', stroke: '#94A3B8', text: '#475569' },
  cluster: { fill: '#FFF1F1', stroke: '#E5484D', text: '#B91C1C' },
};

const nodes: NodeData[] = [
  { id: 'victim', label: 'Victim', sub: 'HDFC XXXX1234', type: 'victim', x: 105, y: 220 },
  { id: 'acct_a', label: 'Account A', sub: 'HDFC XXXX7821', type: 'account', x: 235, y: 158 },
  { id: 'mule_b', label: 'Mule B', sub: 'Paytm XXXX3294', type: 'mule', x: 370, y: 130 },
  { id: 'mule_c', label: 'Mule C (Hub)', sub: 'SBI XXXX9234', type: 'mule', x: 490, y: 200, risk: 'critical' },
  { id: 'atm_gurugram', label: 'Gurugram ATM', sub: 'Sector 29 Cluster', type: 'atm', x: 610, y: 280 },
  { id: 'upi_1', label: 'UPI', sub: '9876543210@paytm', type: 'upi', x: 360, y: 295 },
  { id: 'phone_1', label: 'Phone', sub: '+91-98765-43210', type: 'phone', x: 230, y: 340 },
  { id: 'cluster_1', label: 'Fraud Cluster', sub: '17 prior cases', type: 'cluster', x: 495, y: 350 },
  { id: 'mule_d', label: 'Mule D', sub: 'Axis XXXX4417', type: 'mule', x: 620, y: 150 },
];

const edges = [
  { from: 'victim', to: 'acct_a', label: '₹1.8L', highlight: true },
  { from: 'acct_a', to: 'mule_b', label: '₹1.4L', highlight: true },
  { from: 'mule_b', to: 'mule_c', label: '₹1.1L', highlight: true },
  { from: 'mule_c', to: 'atm_gurugram', label: 'PREDICTED', highlight: true, dashed: true },
  { from: 'mule_b', to: 'upi_1', label: '', highlight: false },
  { from: 'victim', to: 'phone_1', label: '', highlight: false },
  { from: 'mule_c', to: 'cluster_1', label: '', highlight: false },
  { from: 'mule_c', to: 'mule_d', label: '', highlight: false },
  { from: 'mule_d', to: 'atm_gurugram', label: '', highlight: false },
];

export default function FraudNetwork() {
  const [selectedNode, setSelectedNode] = useState<string>('mule_c');
  const [depth, setDepth] = useState(2);
  const selected = nodes.find(n => n.id === selectedNode);

  return (
    <div className="p-7 flex flex-col gap-5" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Fraud Network Intelligence</h1>
            <FeatureTag type="usp" />
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Trace relationships across complaints, accounts, beneficiaries, and cash-out infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Export Graph</Button>
          <Button variant="primary" size="sm">New Investigation</Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4 shrink-0">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#64748B]">Depth</span>
            {[1, 2, 3, 4].map(d => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={`w-8 h-7 text-xs font-semibold rounded-lg transition-all ${depth === d ? 'bg-[#14B8A6] text-white' : 'border border-[#E2E8F0] text-[#64748B] hover:border-[#14B8A6]/40'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-[#E2E8F0]"/>
          {['Time Window', 'Risk Threshold', 'Min Amount', 'Entity Type'].map(f => (
            <select key={f} className="text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#64748B] px-3 py-1.5 focus:outline-none cursor-pointer">
              <option>{f}</option>
            </select>
          ))}
          <div className="ml-auto flex items-center gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-[#14B8A6]"/>
              <span>Confirmed path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0" style={{ borderTop: '2px dashed #E5484D' }}/>
              <span>Predicted path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#CBD5E1]"/>
              <span>Association</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Graph + Entity Panel */}
      <div className="flex-1 grid grid-cols-4 gap-5 min-h-0">

        {/* Graph */}
        <div className="col-span-3 rounded-2xl overflow-hidden border border-[#1E2A3A] relative graph-canvas" style={{ minHeight: '380px' }}>
          <svg width="100%" height="100%" viewBox="0 0 740 440" className="absolute inset-0">
            {/* Edges */}
            {edges.map((e, i) => {
              const from = nodes.find(n => n.id === e.from)!;
              const to = nodes.find(n => n.id === e.to)!;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={e.highlight ? '#14B8A6' : '#2A3548'}
                    strokeWidth={e.highlight ? 2.5 : 1.3}
                    strokeDasharray={e.dashed ? '6 3' : undefined}
                    opacity={e.highlight ? 0.9 : 0.45}
                  />
                  {e.label && (
                    <g>
                      <rect x={midX - 22} y={midY - 9} width={44} height={18} rx={5} fill={e.label === 'PREDICTED' ? '#E5484D' : '#162030'} opacity={0.9}/>
                      <text x={midX} y={midY + 4.5} textAnchor="middle" fill="white" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const colors = nodeColors[node.type];
              const isSelected = selectedNode === node.id;
              const isPath = ['victim', 'acct_a', 'mule_b', 'mule_c', 'atm_gurugram'].includes(node.id);
              return (
                <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node.id)}>
                  {isSelected && <circle cx={node.x} cy={node.y} r={34} fill={colors.stroke} opacity={0.12}/>}
                  <circle
                    cx={node.x} cy={node.y} r={24}
                    fill={colors.fill}
                    stroke={isSelected ? colors.stroke : isPath ? colors.stroke : '#2A3548'}
                    strokeWidth={isSelected ? 2.5 : isPath ? 1.8 : 1}
                    opacity={0.96}
                  />
                  {node.risk === 'critical' && (
                    <circle cx={node.x + 17} cy={node.y - 17} r={7} fill="#E5484D" stroke="#0F1520" strokeWidth={1.5}/>
                  )}
                  <text x={node.x} y={node.y + 1.5} textAnchor="middle" fill={colors.text} fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">
                    {node.label}
                  </text>
                  <text x={node.x} y={node.y + 38} textAnchor="middle" fill="#7C8A9A" fontSize="8" fontFamily="JetBrains Mono, monospace">
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Entity legend */}
          <div className="absolute bottom-4 left-4 bg-[#1A2235]/92 backdrop-blur-sm rounded-xl px-3.5 py-3 border border-[#2A3548]">
            <div className="text-[9px] text-[#6B7C8D] mb-2 font-semibold uppercase tracking-wide">Entity Types</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
              {(Object.keys(nodeColors) as NodeType[]).map(type => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border" style={{ background: nodeColors[type].fill, borderColor: nodeColors[type].stroke }}/>
                  <span className="text-[9px] text-[#CBD5E1] capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5">
            {['+', '−', '⟲'].map(ctrl => (
              <button key={ctrl} className="w-8 h-8 rounded-xl bg-[#1A2235]/90 border border-[#2A3548] text-[#8A95A8] hover:text-white text-sm flex items-center justify-center transition-colors">
                {ctrl}
              </button>
            ))}
          </div>
        </div>

        {/* Entity Panel */}
        <div className="space-y-4 overflow-y-auto">
          <Card className="p-5">
            <div className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Selected Entity</div>
            {selected ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
                    background: nodeColors[selected.type].fill,
                    color: nodeColors[selected.type].text,
                    border: `1px solid ${nodeColors[selected.type].stroke}30`,
                  }}>
                    {selected.type.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A] leading-tight">{selected.label}</div>
                    <div className="text-[10px] font-mono text-[#64748B] mt-0.5">{selected.sub}</div>
                  </div>
                </div>

                {selected.id === 'mule_c' && (
                  <div className="space-y-2.5 text-xs mb-4">
                    <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Risk Score</span><RiskBadge level="critical" score={92}/></div>
                    <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Seen in cases</span><span className="font-semibold font-mono">17</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Total Flow</span><span className="font-semibold font-mono text-red-600">₹31.6L</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Connections</span><span className="font-semibold font-mono">23</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Last Active</span><span className="font-mono text-[#94A3B8]">6 Sep 2026</span></div>
                    <div className="pt-1.5 border-t border-[#F1F5F9]">
                      <div className="text-[#94A3B8] mb-2">Withdrawal Regions</div>
                      <div className="flex flex-wrap gap-1">
                        {['Gurugram', 'Noida', 'Jaipur'].map(r => (
                          <span key={r} className="px-2 py-0.5 text-[10px] rounded-lg bg-[#FFF7ED] text-[#C2410C] border border-orange-200 font-medium">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <AICard className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <SparkleIcon size={11}/>
                    <span className="text-[10px] font-bold text-[#7C5CFC]">AI Insight</span>
                  </div>
                  <p className="text-xs text-[#4C3DB5] leading-relaxed">
                    "This account acts as a hub across 4 otherwise disconnected fraud clusters."
                  </p>
                </AICard>

                <button className="w-full py-2 text-xs font-semibold text-[#14B8A6] border border-[#14B8A6]/20 rounded-xl hover:bg-[#14B8A6]/5 transition-colors">
                  Investigate Connections
                </button>
              </>
            ) : (
              <p className="text-xs text-[#94A3B8] leading-relaxed">Click a node to view entity details and AI insights</p>
            )}
          </Card>

          {/* Graph stats */}
          <Card className="p-4">
            <div className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Graph Overview</div>
            {[
              { label: 'Total Nodes', value: '9' },
              { label: 'Connections', value: '9' },
              { label: 'Mule Accounts', value: '3' },
              { label: 'Money Trail Hops', value: '4' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#64748B]">{s.label}</span>
                <span className="font-mono font-semibold text-[#0F172A]">{s.value}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
