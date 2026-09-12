import React, { useState } from 'react';
import { Card, RiskBadge, Button, AICard, SparkleIcon, TimelineEvent, ConfidenceBar } from '../components/ui';

export default function CaseWorkspace({ onBack }: { onBack?: () => void }) {
  const [xaiExpanded, setXaiExpanded] = useState(true);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={onBack} className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Cases
          </button>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="#CBD5E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-xs text-[#64748B] font-mono">NCRP-26-81942</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[#0F172A]">Case NCRP-26-81942</h1>
              <RiskBadge level="critical" />
              <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">Active Investigation</span>
            </div>
            <p className="text-sm text-[#64748B]">Investment Fraud · ₹4,80,000 · Reported by Victim, New Delhi</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<DocIcon />}>Generate Report</Button>
            <Button variant="secondary" size="sm" icon={<BellIcon />}>Create Alert</Button>
            <Button variant="primary" size="sm" icon={<ShareIcon />}>Share with Bank</Button>
            <button className="w-9 h-9 border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#F7F8FA] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left — Case Snapshot + Timeline */}
        <div className="col-span-3 space-y-4">
          {/* Case Snapshot */}
          <Card className="p-4">
            <div className="font-semibold text-[#0F172A] mb-3 text-sm">Case Snapshot</div>
            <div className="space-y-2.5">
              {[
                { label: 'Complaint Received', value: '13:42 IST' },
                { label: 'Victim Location', value: 'New Delhi' },
                { label: 'Fraud Amount', value: '₹4.8 lakh' },
                { label: 'Transaction Hops', value: '4' },
                { label: 'Linked Accounts', value: '7' },
                { label: 'Model Risk Score', value: '91 / 100' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">{r.label}</span>
                  <span className="text-xs font-semibold text-[#0F172A] font-mono">{r.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <div className="text-xs text-[#64748B] mb-1.5">Predicted Cash-Out</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E5484D] pulse-dot" />
                  <span className="text-xs font-bold text-[#E5484D]">Gurugram Sector 29</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#94A3B8" strokeWidth="1.1"/><path d="M5.5 3V5.5L7 7" stroke="#94A3B8" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  <span className="text-[10px] text-[#94A3B8]">Estimated: 14:28 – 15:32 IST</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-4">
            <div className="font-semibold text-[#0F172A] mb-3 text-sm">Case Timeline</div>
            <div className="space-y-0">
              <TimelineEvent time="13:42" label="Complaint registered" desc="Victim reported investment fraud via NCRP portal" />
              <TimelineEvent time="13:47" label="₹1.8L transferred" desc="Victim account → Account A (HDFC XXXX7821)" isHighlight />
              <TimelineEvent time="13:51" label="₹1.4L transferred" desc="Account A → Mule B (Paytm XXXX3294)" />
              <TimelineEvent time="13:54" label="₹1.1L transferred" desc="Mule B → Mule C (SBI XXXX9234)" />
              <TimelineEvent time="13:58" label="Fraud network match" desc="Account C linked to 17 prior fraud cases" isHighlight />
              <TimelineEvent time="14:01" label="TRINETRA prediction" desc="Gurugram Sector 29 · 91% confidence" />
              <TimelineEvent time="14:03" label="Alert triggered" desc="High-risk cash-out alert issued to bank" isHighlight isLast />
            </div>
          </Card>
        </div>

        {/* Center — AI Prediction */}
        <div className="col-span-5 space-y-4">
          {/* Prediction Card */}
          <div className="rounded-2xl overflow-hidden border border-[#7C5CFC]/20 shadow-sm">
            <div className="ai-gradient px-5 py-4 flex items-center gap-3">
              <SparkleIcon size={18} />
              <div>
                <div className="text-white font-bold text-base">TRINETRA Prediction</div>
                <div className="text-white/70 text-xs">AI-generated cash-out risk forecast</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-white text-4xl font-bold leading-none">91%</div>
                <div className="text-white/80 text-xs font-semibold mt-0.5">HIGH CONFIDENCE</div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-[#7C5CFC]/5 to-[#4338CA]/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">Gurugram Sector 29 ATM Cluster</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Haryana · 14 ATMs in cluster radius</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#7C5CFC]">Estimated Window</div>
                  <div className="font-mono text-sm font-bold text-[#0F172A]">46–110 minutes</div>
                </div>
              </div>

              {/* Explainability */}
              <button
                onClick={() => setXaiExpanded(!xaiExpanded)}
                className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-3 hover:text-[#7C5CFC] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#7C5CFC" strokeWidth="1.3"/><path d="M7 4.5V7L8.5 8.5" stroke="#7C5CFC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Why this prediction?
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${xaiExpanded ? 'rotate-90' : ''}`}><path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {xaiExpanded && (
                <div className="space-y-2.5 fade-in">
                  <ConfidenceBar label="3 accounts linked to prior NCRP fraud trails" value={29} color="#7C5CFC" />
                  <ConfidenceBar label="Transaction velocity matches known cash-out pattern" value={23} color="#5B8BFC" />
                  <ConfidenceBar label="Destination geographically linked to Gurugram cluster" value={18} color="#14B8A6" />
                  <ConfidenceBar label="Similar fraud cases cashed out within 90 minutes" value={13} color="#14B8A6" />
                  <ConfidenceBar label="OSINT corroboration signal (3 reports)" value={8} color="#94A3B8" />
                </div>
              )}

              <button className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl border border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-colors flex items-center justify-center gap-2">
                <SparkleIcon size={13} />
                View Full Model Explanation
              </button>
            </div>
          </div>

          {/* Transaction Trail */}
          <Card className="p-5">
            <div className="font-semibold text-[#0F172A] mb-4 text-sm">Transaction Trail</div>
            <div className="space-y-3">
              {[
                { from: 'Victim • HDFC XXXX1234', to: 'Account A • HDFC XXXX7821', amount: '₹1.8L', time: '13:47', risk: 'medium' as const },
                { from: 'Account A • HDFC XXXX7821', to: 'Mule B • Paytm XXXX3294', amount: '₹1.4L', time: '13:51', risk: 'high' as const },
                { from: 'Mule B • Paytm XXXX3294', to: 'Mule C • SBI XXXX9234', amount: '₹1.1L', time: '13:54', risk: 'critical' as const },
                { from: 'Mule C • SBI XXXX9234', to: 'Gurugram ATM Cluster', amount: '₹1.1L', time: 'PREDICTED', risk: 'critical' as const },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 text-right">
                    <div className="text-xs text-[#64748B] truncate max-w-[140px] ml-auto">{t.from}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-full" style={{
                      background: t.risk === 'critical' ? '#E5484D' : t.risk === 'high' ? '#F97316' : '#F59E0B',
                      fontSize: '9px',
                    }}>
                      {t.amount}
                    </div>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M2 6H18M14 2L18 6L14 10" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[9px] font-mono text-[#94A3B8]">{t.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#0F172A] font-medium truncate max-w-[140px]">{t.to}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — Evidence + Actions */}
        <div className="col-span-4 space-y-4">
          {/* Alert Actions */}
          <Card className="p-4">
            <div className="font-semibold text-[#0F172A] text-sm mb-3">Intervention Actions</div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#E5484D] text-white text-sm font-semibold hover:bg-[#D43840] transition-colors">
                <BellIcon />
                Notify Bank (ABC Bank)
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E2E8F0] text-[#0F172A] text-sm font-medium hover:bg-[#F7F8FA] transition-colors">
                <ShareIcon />
                Notify Law Enforcement
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#14B8A6] text-white text-sm font-semibold hover:bg-[#0F9E8E] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.3"/><path d="M5 7L6.5 8.5L9.5 5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Mark as Acknowledged
              </button>
            </div>
          </Card>

          {/* Linked Accounts */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-[#0F172A] text-sm">Linked Accounts</div>
              <span className="text-xs text-[#14B8A6] font-medium">7 total</span>
            </div>
            <div className="space-y-2">
              {[
                { id: 'XXXX7821', bank: 'HDFC Bank', type: 'Transit', risk: 'medium' as const },
                { id: 'XXXX3294', bank: 'Paytm Payments', type: 'Mule', risk: 'high' as const },
                { id: 'XXXX9234', bank: 'SBI', type: 'Mule Hub', risk: 'critical' as const },
                { id: 'XXXX4417', bank: 'Axis Bank', type: 'Linked', risk: 'high' as const },
              ].map(a => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#14B8A6]/30 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F8FA] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="4" width="11" height="7.5" rx="1.5" stroke="#64748B" strokeWidth="1.2"/><path d="M4 4V3C4 2.17 4.67 1.5 5.5 1.5H8.5C9.33 1.5 10 2.17 10 3V4" stroke="#64748B" strokeWidth="1.2"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-bold text-[#0F172A]">{a.id}</div>
                    <div className="text-[10px] text-[#64748B]">{a.bank} · {a.type}</div>
                  </div>
                  <RiskBadge level={a.risk} />
                </div>
              ))}
            </div>
          </Card>

          {/* OSINT Evidence */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-[#7C5CFC]/10 flex items-center justify-center">
                <SparkleIcon size={11} />
              </div>
              <div className="font-semibold text-[#0F172A] text-sm">OSINT Evidence</div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium ml-auto">3 signals</span>
            </div>
            <div className="space-y-2">
              {[
                { source: 'Verified News', text: 'NCR mule account scam network reported by TOI', credibility: 96 },
                { source: 'Social Signal', text: 'Multiple users report similar investment scheme', credibility: 72 },
                { source: 'Web Analysis', text: 'Gurugram Sector 29 ATM cluster flagged in fraud database', credibility: 88 },
              ].map((e, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#7C5CFC]">{e.source}</span>
                    <span className={`font-mono font-bold ${e.credibility > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{e.credibility}%</span>
                  </div>
                  <p className="text-[#475569] leading-snug">{e.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DocIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 5H8.5M4.5 7H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function BellIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5C4.6 1.5 3 3.1 3 5V8L2 9H11L10 8V5C10 3.1 8.4 1.5 6.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 9C5.5 9.83 5.95 10.5 6.5 10.5S7.5 9.83 7.5 9" stroke="currentColor" strokeWidth="1.2"/></svg>;
}
function ShareIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.3 5.7L8.7 3.3M4.3 7.3L8.7 9.7" stroke="currentColor" strokeWidth="1.2"/></svg>;
}
