import React, { useState } from 'react';
import { Card, Button, AICard, SparkleIcon, FeatureTag, SectionLabel } from '../components/ui';

const signals = [
  {
    id: 1,
    sourceType: 'Verified News Outlet',
    headline: 'Police identify digital-arrest scam operating through mule accounts in NCR',
    location: 'Delhi NCR',
    credibility: 96,
    credLabel: 'VERIFIED',
    credColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    corroborated: 5,
    summary: 'Multiple law enforcement sources confirm an active digital-arrest scam network operating across NCR. Mule accounts tied to Gurugram and Noida areas.',
    signals: ['5 independent sources', 'Source reliability: High', 'Location verified: Yes'],
    timeAgo: '8 min ago',
  },
  {
    id: 2,
    sourceType: 'Public Social Signal',
    headline: 'Multiple users reporting fraudulent investment scheme linked to NCR region',
    location: 'Jaipur / NCR',
    credibility: 72,
    credLabel: 'PARTIALLY VERIFIED',
    credColor: 'text-amber-600 bg-amber-50 border-amber-200',
    corroborated: 3,
    summary: 'Public reports of investment fraud targeting salaried professionals. Screenshots partially match existing NCRP complaints.',
    signals: ['3 independent reports', 'Account age: verified', 'Location consistency: medium'],
    timeAgo: '24 min ago',
  },
  {
    id: 3,
    sourceType: 'Social Media',
    headline: 'Major bank hacked — all customer accounts affected across India',
    location: 'Unverified',
    credibility: 18,
    credLabel: 'LIKELY MISLEADING',
    credColor: 'text-red-600 bg-red-50 border-red-200',
    corroborated: 0,
    summary: 'Viral claim reuses imagery from an unrelated 2024 incident. No credible corroboration found from any trusted source.',
    signals: ['No trusted corroboration', 'Image reused from 2024', 'Source reliability: Low'],
    timeAgo: '1h ago',
  },
  {
    id: 4,
    sourceType: 'Web Intelligence',
    headline: 'Surge in cryptocurrency-linked investment fraud in Tier-2 cities',
    location: 'Lucknow, Jaipur, Indore',
    credibility: 84,
    credLabel: 'VERIFIED',
    credColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    corroborated: 4,
    summary: 'Multiple verified fintech monitoring sources report increased crypto-linked investment fraud targeting younger demographics.',
    signals: ['4 independent sources', 'Platform analysis: confirmed', 'Temporal match: High'],
    timeAgo: '2h ago',
  },
];

const pipeline = [
  { step: '01', label: 'Public Signal', color: '#7C5CFC' },
  { step: '02', label: 'Source Analysis', color: '#6B5CF0' },
  { step: '03', label: 'Duplicate Detection', color: '#5B8BFC' },
  { step: '04', label: 'Cross-Source Corroboration', color: '#14B8A6' },
  { step: '05', label: 'Location / Time Validation', color: '#14B8A6' },
  { step: '06', label: 'Content Verification', color: '#0D9488' },
  { step: '07', label: 'Credibility Score', color: '#10B981' },
  { step: '08', label: 'Investigator Review', color: '#059669' },
];

export default function OSINTIntelligence() {
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
  const toggleExpand = (id: number) => setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="p-7 space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">OSINT Evidence & Credibility Intelligence</h1>
            <FeatureTag type="usp" />
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-xl">
            Verify open-source signals and public intelligence before incorporating them into investigative decisions.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7C5CFC]/6 border border-[#7C5CFC]/18 text-xs font-medium text-[#7C5CFC]">
            <SparkleIcon size={11} />
            USP Layer: Open-Source Intelligence Verification — not present in standard SIH requirements
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Configure Sources</Button>
          <Button variant="primary" size="sm">Analyse Signal</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Signals Analysed', value: '12,482', color: '#7C5CFC', sub: 'All public sources' },
          { label: 'Verified', value: '8,914', color: '#14B8A6', sub: '71.4% verified rate' },
          { label: 'Potential Misinformation', value: '742', color: '#E5484D', sub: 'Flagged for review' },
          { label: 'Emerging Narratives', value: '18', color: '#F59E0B', sub: 'Needs monitoring' },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <div className="text-[28px] font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold text-[#0F172A]">{s.label}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Verification Pipeline */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="font-semibold text-[#0F172A]">Credibility Verification Pipeline</div>
            <div className="text-xs text-[#94A3B8] mt-1">Every incoming signal passes through this 8-step automated workflow</div>
          </div>
          <FeatureTag type="usp" />
        </div>

        {/* Pipeline steps */}
        <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
          {pipeline.map((step, i) => (
            <div key={step.step} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center px-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold mb-1.5 shadow-sm"
                  style={{ background: step.color }}>
                  {step.step}
                </div>
                <div className="text-[10px] text-center text-[#475569] max-w-[80px] leading-tight font-medium">
                  {step.label}
                </div>
              </div>
              {i < pipeline.length - 1 && (
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="flex-shrink-0 mb-5">
                  <path d="M1 6H19M15 2L19 6L15 10" stroke="#CBD5E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl border border-[#E2E8F0]">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#94A3B8" strokeWidth="1.1"/><path d="M6.5 4V6.5L8 8" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/></svg>
          <span className="text-xs text-[#64748B] italic">
            OSINT signals are supporting intelligence — never treated as independently verified legal evidence.
          </span>
        </div>
      </Card>

      {/* Feed + Sidebar */}
      <div className="grid grid-cols-3 gap-5">
        {/* Signal Feed */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[#0F172A]">Intelligence Feed</div>
            <div className="flex items-center gap-3">
              <select className="text-xs border border-[#E2E8F0] rounded-xl bg-white text-[#64748B] px-3 py-1.5 focus:outline-none cursor-pointer">
                <option>All Sources</option>
                <option>Verified Only</option>
                <option>Misleading</option>
              </select>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"/>
                <span>Live feed</span>
              </div>
            </div>
          </div>

          {signals.map(signal => (
            <Card key={signal.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Source + credibility */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wide">{signal.sourceType}</span>
                        <span className="text-[10px] text-[#94A3B8]">·</span>
                        <span className="text-[10px] text-[#94A3B8]">{signal.timeAgo}</span>
                        <span className="text-[10px] text-[#94A3B8]">·</span>
                        <span className="text-[10px] text-[#64748B]">{signal.location}</span>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-lg border ${signal.credColor}`}>
                        {signal.credibility} · {signal.credLabel}
                      </span>
                    </div>

                    {/* Headline */}
                    <div className="text-sm font-semibold text-[#0F172A] leading-snug mb-3">
                      {signal.headline}
                    </div>

                    {/* Credibility bar */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${signal.credibility}%`,
                          background: signal.credibility > 80 ? '#10B981' : signal.credibility > 50 ? '#F59E0B' : '#E5484D',
                        }}/>
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8] flex-shrink-0">Credibility</span>
                    </div>

                    {/* Signal tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {signal.signals.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-[#F7F8FA] border border-[#E2E8F0] text-[#64748B]">{s}</span>
                      ))}
                    </div>

                    {/* Expanded content */}
                    {expandedIds[signal.id] && (
                      <div className="mt-3 pt-3 border-t border-[#F1F5F9] fade-in">
                        <p className="text-xs text-[#475569] leading-relaxed">{signal.summary}</p>
                        <button className="mt-2 text-xs font-medium text-[#14B8A6] hover:underline">View Evidence Chain →</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-2.5 border-t border-[#F8FAFC] bg-[#FAFBFC] flex items-center gap-2">
                <button onClick={() => toggleExpand(signal.id)} className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
                  {expandedIds[signal.id] ? '▲ Collapse' : '▼ Expand detail'}
                </button>
                <div className="flex-1"/>
                <button className="text-xs font-medium text-[#14B8A6] border border-[#14B8A6]/20 px-3 py-1 rounded-lg hover:bg-[#14B8A6]/5 transition-colors">
                  Add to Case
                </button>
                <button className="text-xs font-medium text-[#64748B] border border-[#E2E8F0] px-3 py-1 rounded-lg hover:bg-[#F7F8FA] transition-colors">
                  Dismiss
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="font-semibold text-[#0F172A] text-sm mb-4">Source Breakdown</div>
            {[
              { label: 'Verified News', count: 3842, pct: 31 },
              { label: 'Web Intelligence', count: 2908, pct: 23 },
              { label: 'Social Media', count: 3164, pct: 25 },
              { label: 'Public Reports', count: 2568, pct: 21 },
            ].map(s => (
              <div key={s.label} className="mb-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#475569]">{s.label}</span>
                  <span className="font-mono font-semibold text-[#0F172A]">{s.count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: `${s.pct}%` }}/>
                </div>
              </div>
            ))}
          </Card>

          <AICard title="Emerging Narratives">
            <div className="space-y-3 mt-1">
              {[
                { text: 'Digital arrest scam using fake CBI impersonation', count: 8 },
                { text: 'UPI QR code phishing targeting merchants', count: 5 },
                { text: 'Investment fraud via WhatsApp groups', count: 3 },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-[#7C5CFC]/15 flex items-center justify-center text-[#7C5CFC] text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-xs text-[#3D2FA8] leading-snug">{n.text}</div>
                    <div className="text-[10px] text-[#7C5CFC]/70 mt-0.5">{n.count} signals</div>
                  </div>
                </div>
              ))}
            </div>
          </AICard>

          <Card className="p-4">
            <div className="text-xs font-semibold text-[#0F172A] mb-2">Why this matters</div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              OSINT verification prevents false positives by cross-checking signals before they influence investigative decisions. This layer is unique to TRINETRA.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
