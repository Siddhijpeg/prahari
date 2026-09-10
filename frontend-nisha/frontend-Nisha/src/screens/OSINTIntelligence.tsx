import React, { useState } from 'react';
import { Card, FeatureTag } from '../components/ui';
import { MOCK_OSINT_SIGNALS } from '../data/mockOsint';
import type { OsintSignal, OsintVerification } from '../types';

const VERIFICATION_CONFIG: Record<OsintVerification, { label: string; cls: string }> = {
  'VERIFIED':            { label: 'VERIFIED',            cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'PARTIALLY VERIFIED':  { label: 'PARTIAL',             cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  'UNVERIFIED':          { label: 'UNVERIFIED',          cls: 'bg-[#F7F8FA] text-[#94A3B8] border-[#E2E8F0]' },
  'LIKELY MISLEADING':   { label: 'MISLEADING',          cls: 'bg-red-50 text-[#E5484D] border-red-200' },
};

export default function OSINTIntelligence() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-7 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[24px] font-bold text-[#0F172A] leading-tight">OSINT Intelligence</h1>
            <FeatureTag type="usp" />
          </div>
          <p className="text-sm text-[#64748B]">
            Open-source signals supporting active investigations.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-xl bg-[#7C5CFC]/5 border border-[#7C5CFC]/15 text-xs text-[#7C5CFC]">
        OSINT supports investigation and is <strong>not</strong> treated as primary transactional evidence. It is not a direct input to the prediction score in the current prototype.
      </div>

      {/* Signal table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="text-sm font-semibold text-[#0F172A]">Signal Feed</div>
          <span className="text-xs text-[#94A3B8]">{MOCK_OSINT_SIGNALS.length} signals · Updated 12 min ago</span>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {MOCK_OSINT_SIGNALS.map((signal) => {
            const verif = VERIFICATION_CONFIG[signal.verification];
            const isExpanded = expandedId === signal.signalId;
            return (
              <div key={signal.signalId} className="px-5 py-4">
                <div className="flex items-start gap-4">
                  {/* Credibility */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="text-lg font-bold font-mono" style={{
                      color: signal.credibilityScore >= 80 ? '#10B981' :
                             signal.credibilityScore >= 60 ? '#F59E0B' :
                             signal.credibilityScore >= 40 ? '#F97316' : '#E5484D',
                    }}>
                      {signal.credibilityScore}
                    </div>
                    <div className="text-[9px] text-[#94A3B8] uppercase">Cred.</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${verif.cls}`}>
                        {verif.label}
                      </span>
                      <span className="text-[10px] text-[#7C5CFC] font-medium">{signal.source}</span>
                      <span className="text-[10px] text-[#94A3B8]">· {signal.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#0F172A] font-medium leading-snug mb-0.5">{signal.headline}</p>
                    <div className="text-[10px] text-[#94A3B8]">{signal.location}</div>

                    {/* Evidence chain expandable */}
                    {signal.evidenceChain && (
                      <>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : signal.signalId)}
                          className="mt-1.5 text-[10px] text-[#14B8A6] hover:underline"
                        >
                          {isExpanded ? '▲ Hide Evidence Chain' : '▼ Show Evidence Chain'}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 space-y-1 fade-in">
                            {signal.evidenceChain.map((e, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
                                <span className="text-[#14B8A6] flex-shrink-0 mt-0.5">•</span>
                                <span>{e}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
