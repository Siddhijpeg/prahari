import React, { useState } from 'react';
import { Card, RiskBadge, Button, SearchBar, FilterSelect, FeatureTag } from '../components/ui';

const cases = [
  { id: 'NCRP-26-81942', type: 'Investment Fraud', reported: '12 min ago', amount: '₹4.8L', source: 'Delhi', predicted: 'Gurugram', risk: 91, level: 'critical' as const, status: 'Active', investigator: 'A. Mehta' },
  { id: 'NCRP-26-81911', type: 'Digital Arrest', reported: '31 min ago', amount: '₹9.4L', source: 'Lucknow', predicted: 'Jaipur', risk: 86, level: 'critical' as const, status: 'Active', investigator: 'R. Sharma' },
  { id: 'NCRP-26-81895', type: 'Investment Fraud', reported: '44 min ago', amount: '₹7.1L', source: 'Noida', predicted: 'Jaipur', risk: 79, level: 'high' as const, status: 'Active', investigator: 'P. Verma' },
  { id: 'NCRP-26-81773', type: 'UPI Fraud', reported: '1h 12min ago', amount: '₹2.2L', source: 'Mumbai', predicted: 'Thane', risk: 72, level: 'high' as const, status: 'In Review', investigator: 'S. Gupta' },
  { id: 'NCRP-26-81742', type: 'Impersonation', reported: '2h 04min ago', amount: '₹1.4L', source: 'Bengaluru', predicted: 'Bengaluru Central', risk: 65, level: 'high' as const, status: 'Active', investigator: 'M. Nair' },
  { id: 'NCRP-26-81631', type: 'UPI Fraud', reported: '3h 18min ago', amount: '₹0.8L', source: 'Hyderabad', predicted: 'Secunderabad', risk: 54, level: 'medium' as const, status: 'Investigating', investigator: 'K. Reddy' },
  { id: 'NCRP-26-81602', type: 'Investment Fraud', reported: '4h 52min ago', amount: '₹3.6L', source: 'Kolkata', predicted: 'Salt Lake', risk: 48, level: 'medium' as const, status: 'In Review', investigator: 'D. Bose' },
  { id: 'NCRP-26-81540', type: 'Digital Arrest', reported: '6h 30min ago', amount: '₹12.2L', source: 'Chennai', predicted: 'T. Nagar', risk: 41, level: 'medium' as const, status: 'Investigating', investigator: 'A. Kumar' },
  { id: 'NCRP-26-81498', type: 'Impersonation', reported: '8h ago', amount: '₹0.6L', source: 'Pune', predicted: 'Pimpri', risk: 28, level: 'low' as const, status: 'Resolved', investigator: 'N. Patil' },
  { id: 'NCRP-26-81347', type: 'UPI Fraud', reported: '11h ago', amount: '₹0.4L', source: 'Ahmedabad', predicted: 'N/A', risk: 15, level: 'low' as const, status: 'Resolved', investigator: 'H. Patel' },
];

const statusColors: Record<string, string> = {
  'Active': 'bg-red-50 text-red-600 border-red-200',
  'In Review': 'bg-amber-50 text-amber-600 border-amber-200',
  'Investigating': 'bg-blue-50 text-blue-600 border-blue-200',
  'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function Cases({ onOpenCase }: { onOpenCase: () => void }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Cases', count: 1284 },
    { id: 'critical', label: 'Critical', count: 89 },
    { id: 'active', label: 'Active', count: 412 },
    { id: 'reviewing', label: 'In Review', count: 203 },
    { id: 'resolved', label: 'Resolved', count: 580 },
  ];

  return (
    <div className="p-7 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Cybercrime Cases</h1>
            <FeatureTag type="sih" />
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed">Investigate complaints and prioritise cases using predictive risk intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<DownloadIcon />} size="sm">Export</Button>
          <Button variant="primary" icon={<PlusIcon />} size="sm">New Case</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-[#F7F8FA] rounded-xl p-1 border border-[#E2E8F0]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>
                {tab.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
        <div className="text-xs text-[#94A3B8] font-mono">Auto-refresh: 30s</div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            placeholder="Search case ID, account, phone, UPI…"
            value={search}
            onChange={setSearch}
            className="w-72"
          />
          <FilterSelect label="Fraud Type" options={['Investment Fraud', 'UPI Fraud', 'Digital Arrest', 'Impersonation']} />
          <FilterSelect label="State" options={['Delhi', 'Maharashtra', 'UP', 'Rajasthan', 'Karnataka', 'West Bengal']} />
          <FilterSelect label="Risk Level" options={['Critical', 'High', 'Medium', 'Low']} />
          <FilterSelect label="Amount" options={['< ₹1L', '₹1L–5L', '₹5L–20L', '> ₹20L']} />
          <FilterSelect label="Status" options={['Active', 'In Review', 'Investigating', 'Resolved']} />
          <button className="ml-auto text-xs text-[#14B8A6] font-medium hover:underline">Reset Filters</button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0]" style={{ background: '#F8FAFC' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Case ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Complaint Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Reported</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Predicted Zone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Risk Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Investigator</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={onOpenCase}
                  className={`border-b border-[#F1F5F9] hover:bg-[#F7FFFE] cursor-pointer transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-mono text-xs font-bold text-[#0F172A]">{c.id}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-[#0F172A]">{c.type}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] font-mono">{c.reported}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-[#0F172A]">{c.amount}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#64748B]">{c.source}</td>
                  <td className="px-4 py-3.5">
                    {c.predicted !== 'N/A' ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.level === 'critical' ? '#E5484D' : c.level === 'high' ? '#F97316' : '#F59E0B' }} />
                        <span className="text-xs font-medium text-[#0F172A]">{c.predicted}</span>
                      </div>
                    ) : <span className="text-xs text-[#94A3B8]">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${c.risk}%`,
                          background: c.risk > 80 ? '#E5484D' : c.risk > 60 ? '#F97316' : c.risk > 40 ? '#F59E0B' : '#14B8A6',
                        }} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#0F172A]">{c.risk}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${statusColors[c.status] || ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B]">{c.investigator}</td>
                  <td className="px-4 py-3.5">
                    <button className="text-[#14B8A6] hover:text-[#0D9488] text-xs font-medium">Open →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0]">
          <span className="text-xs text-[#64748B]">Showing 10 of 1,284 cases</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 129].map((p, i) => (
              <button
                key={i}
                className={`w-8 h-8 text-xs rounded-lg transition-colors ${p === 1 ? 'bg-[#14B8A6] text-white font-semibold' : 'text-[#64748B] hover:bg-[#F7F8FA] border border-[#E2E8F0]'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function PlusIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function DownloadIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5V9M4 7L6.5 9.5L9 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 10.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
