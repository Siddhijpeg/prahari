import React, { useState } from 'react';
import { Card, RiskBadge, Button, Tabs, FeatureTag } from '../components/ui';

const alerts = [
  {
    id: 'ALT-2026-081942',
    case: 'NCRP-26-81942',
    type: 'CRITICAL CASH-OUT RISK',
    zone: 'Gurugram Sector 29',
    risk: 91,
    level: 'critical' as const,
    window: '46–110 minutes',
    amount: '₹4.8L',
    bank: 'HDFC Bank',
    generated: '2 min ago',
    timeline: ['Prediction generated', 'Alert issued', 'Bank notified', 'LEA acknowledged'],
    completedSteps: 3,
  },
  {
    id: 'ALT-2026-081911',
    case: 'NCRP-26-81911',
    type: 'HIGH RISK CASH-OUT',
    zone: 'Jaipur Central Market',
    risk: 86,
    level: 'critical' as const,
    window: '20–85 minutes',
    amount: '₹9.4L',
    bank: 'SBI',
    generated: '14 min ago',
    timeline: ['Prediction generated', 'Alert issued', 'Bank notified'],
    completedSteps: 2,
  },
  {
    id: 'ALT-2026-081773',
    case: 'NCRP-26-81773',
    type: 'ELEVATED RISK ALERT',
    zone: 'Noida Sector 18',
    risk: 84,
    level: 'high' as const,
    window: '35–120 minutes',
    amount: '₹2.2L',
    bank: 'ICICI Bank',
    generated: '38 min ago',
    timeline: ['Prediction generated', 'Alert issued'],
    completedSteps: 1,
  },
  {
    id: 'ALT-2026-081895',
    case: 'NCRP-26-81895',
    type: 'HIGH RISK CASH-OUT',
    zone: 'Jaipur Airport Zone',
    risk: 79,
    level: 'high' as const,
    window: '72–180 minutes',
    amount: '₹7.1L',
    bank: 'Axis Bank',
    generated: '1h ago',
    timeline: ['Prediction generated', 'Alert issued', 'Bank notified', 'LEA acknowledged', 'Intervention requested'],
    completedSteps: 4,
  },
];

const tabs = [
  { id: 'all', label: 'All', count: 143 },
  { id: 'critical', label: 'Critical', count: 12 },
  { id: 'high', label: 'High', count: 31 },
  { id: 'acknowledged', label: 'Acknowledged', count: 89 },
  { id: 'resolved', label: 'Resolved', count: 11 },
];

export default function AlertCenter({ onOpenCase }: { onOpenCase?: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Proactive Intervention Alerts</h1>
            <FeatureTag type="sih" />
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed">Real-time alerts for high-probability cash-out events requiring immediate action.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            12 critical unactioned
          </div>
          <Button variant="secondary" size="sm">Configure Rules</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`overflow-hidden ${alert.level === 'critical' ? 'border-[#E5484D]/25' : 'border-[#E2E8F0]'}`}>
            {/* Alert Header */}
            <div className={`px-5 py-3 border-b flex items-center justify-between ${alert.level === 'critical' ? 'bg-red-50 border-red-100' : 'bg-[#FFF7ED] border-amber-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${alert.level === 'critical' ? 'bg-red-500 pulse-dot' : 'bg-amber-500'}`} />
                <span className={`text-xs font-bold uppercase tracking-wide ${alert.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                  {alert.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#94A3B8]">{alert.id}</span>
                <span className="text-xs text-[#94A3B8]">· {alert.generated}</span>
              </div>
            </div>

            {/* Alert Body */}
            <div className="p-5">
              <div className="grid grid-cols-12 gap-4">
                {/* Main Info */}
                <div className="col-span-8">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Risk Gauge */}
                    <div className="text-center flex-shrink-0">
                      <div className={`text-4xl font-bold ${alert.level === 'critical' ? 'text-[#E5484D]' : 'text-[#F97316]'}`}>
                        {alert.risk}%
                      </div>
                      <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Cash-Out Risk</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-[#0F172A]">{alert.case}</span>
                        <RiskBadge level={alert.level} />
                      </div>
                      <div className="text-sm font-semibold text-[#0F172A] mb-2">
                        Predicted Zone: {alert.zone}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Expected Window', value: alert.window },
                          { label: 'Amount at Risk', value: alert.amount },
                          { label: 'Relevant Bank', value: alert.bank },
                        ].map(d => (
                          <div key={d.label} className="bg-[#F7F8FA] rounded-xl p-2.5 border border-[#E2E8F0]">
                            <div className="text-[10px] text-[#94A3B8] font-medium">{d.label}</div>
                            <div className="text-sm font-bold text-[#0F172A] mt-0.5 font-mono">{d.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-[#E5484D] hover:bg-[#D43840] transition-colors">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5C4.6 1.5 3 3.1 3 5V8L2 9H11L10 8V5C10 3.1 8.4 1.5 6.5 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      Notify Bank
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl bg-[#7C5CFC] hover:bg-[#6D4FF5] transition-colors">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="9" cy="2.5" r="1.5" stroke="white" strokeWidth="1.1"/><circle cx="9" cy="10.5" r="1.5" stroke="white" strokeWidth="1.1"/><circle cx="3" cy="6.5" r="1.5" stroke="white" strokeWidth="1.1"/><path d="M4.3 5.7L7.7 3.3M4.3 7.3L7.7 9.7" stroke="white" strokeWidth="1.1"/></svg>
                      Notify LEA
                    </button>
                    <button
                      onClick={onOpenCase}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6]/5 transition-colors"
                    >
                      Open Investigation
                    </button>
                    <button
                      onClick={() => setAcknowledgedAlerts(prev => ({ ...prev, [alert.id]: true }))}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                        acknowledgedAlerts[alert.id]
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F7F8FA]'
                      }`}
                    >
                      {acknowledgedAlerts[alert.id] ? '✓ Acknowledged' : 'Mark Acknowledged'}
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="col-span-4 border-l border-[#F1F5F9] pl-4">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">Alert Timeline</div>
                  <div className="space-y-1">
                    {alert.timeline.map((step, i) => (
                      <div key={step} className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i <= alert.completedSteps ? 'bg-[#14B8A6]' : 'bg-[#E2E8F0]'}`} />
                        <span className={`text-xs ${i <= alert.completedSteps ? 'text-[#0F172A] font-medium' : 'text-[#94A3B8]'}`}>{step}</span>
                        {i <= alert.completedSteps && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto flex-shrink-0">
                            <circle cx="6" cy="6" r="5" fill="#ECFDF5"/>
                            <path d="M3.5 6L5 7.5L8.5 4" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
