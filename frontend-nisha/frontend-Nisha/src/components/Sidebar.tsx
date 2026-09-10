import React from 'react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

const NAV_MAIN: NavItem[] = [
  { id: 'command', label: 'Command Center', icon: <CommandIcon /> },
  { id: 'cases', label: 'Cases', icon: <CasesIcon />, badge: 1284 },
  { id: 'prediction', label: 'Prediction Engine', icon: <PredictionIcon /> },
  { id: 'geo', label: 'Geo Intelligence', icon: <GeoIcon /> },
  { id: 'fraud-network', label: 'Fraud Network', icon: <NetworkIcon /> },
  { id: 'osint', label: 'OSINT Intelligence', icon: <OsintIcon /> },
  { id: 'alerts', label: 'Alerts', icon: <AlertIcon />, badge: 143 },
  { id: 'copilot', label: 'AI Copilot', icon: <CopilotIcon /> },
  { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
];

const NAV_SYSTEM: NavItem[] = [
  { id: 'datasources', label: 'Data Sources', icon: <DataSourceIcon /> },
  { id: 'model', label: 'Model Monitor', icon: <ModelIcon /> },
  { id: 'audit', label: 'Audit Logs', icon: <AuditIcon /> },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="w-[220px] min-w-[220px] h-full flex flex-col" style={{ background: '#15171A' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#2A2D32' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }}>
            <TrinetraLogo />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight tracking-tight">TRINETRA</div>
            <div className="text-[10px] font-medium" style={{ color: '#6B7280' }}>Cyber Intelligence</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="mb-1">
          {NAV_MAIN.map(item => (
            <NavItemRow key={item.id} item={item} active={active} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="mx-3 my-3 border-t" style={{ borderColor: '#2A2D32' }} />

        <div className="mb-1 px-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#4B5563' }}>System</span>
        </div>
        {NAV_SYSTEM.map(item => (
          <NavItemRow key={item.id} item={item} active={active} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t px-2 py-3" style={{ borderColor: '#2A2D32' }}>
        <NavItemRow
          item={{ id: 'settings', label: 'Settings', icon: <SettingsIcon /> }}
          active={active}
          onNavigate={onNavigate}
        />
        <NavItemRow
          item={{ id: 'help', label: 'Help & Docs', icon: <HelpIcon /> }}
          active={active}
          onNavigate={onNavigate}
        />
      </div>

      {/* User Card */}
      <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: '#1E2126', border: '1px solid #2A2D32' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] text-xs font-bold">AM</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white leading-tight truncate">Aarav Mehta</div>
            <div className="text-[10px] leading-tight truncate" style={{ color: '#6B7280' }}>Cyber Intelligence Analyst</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] font-medium" style={{ color: '#10B981' }}>Authorised Access</span>
        </div>
      </div>
    </aside>
  );
}

function NavItemRow({ item, active, onNavigate }: { item: NavItem; active: string; onNavigate: (id: string) => void }) {
  const isActive = active === item.id;
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left mb-0.5 relative group`}
      style={{
        background: isActive ? '#1A2F2E' : 'transparent',
        color: isActive ? '#14B8A6' : '#A0A8B4',
      }}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#14B8A6]" />
      )}
      <span className={`flex-shrink-0 ${isActive ? 'text-[#14B8A6]' : 'text-[#6B7280] group-hover:text-[#A0A8B4]'}`}>
        {item.icon}
      </span>
      <span className={`text-[13px] font-medium flex-1 ${isActive ? 'text-white' : 'group-hover:text-[#D1D5DB]'}`}>
        {item.label}
      </span>
      {item.badge !== undefined && (
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${isActive ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-[#1E2126] text-[#6B7280]'}`}>
          {item.badge > 999 ? '999+' : item.badge}
        </span>
      )}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrinetraLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="5" r="2.5" fill="white" opacity="0.95"/>
      <circle cx="4.5" cy="13" r="2.5" fill="white" opacity="0.75"/>
      <circle cx="13.5" cy="13" r="2.5" fill="white" opacity="0.75"/>
      <path d="M9 7.5L4.5 10.5M9 7.5L13.5 10.5M4.5 10.5L13.5 10.5" stroke="white" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
}

function CommandIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>;
}

function CasesIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 3V2.5C5 1.67 5.67 1 6.5 1H9.5C10.33 1 11 1.67 11 2.5V3" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8H11M5 11H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

function PredictionIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L5.5 7.5L8.5 9.5L12 4L14 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2L14 4L12 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function GeoIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1.5V12.5M2.5 7H13.5M3 4.5C4.2 5.8 5.9 6.5 8 6.5S11.8 5.8 13 4.5M3 9.5C4.2 8.2 5.9 7.5 8 7.5S11.8 8.2 13 9.5" stroke="currentColor" strokeWidth="1.1"/></svg>;
}

function NetworkIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="2.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="13.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="2.5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="13.5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4L6.5 6.5M12 4L9.5 6.5M4 12L6.5 9.5M12 12L9.5 9.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function OsintIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 4.5V7L8.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function AlertIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="currentColor"/></svg>;
}

function CopilotIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
}

function ReportsIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 5H10M6 7.5H10M6 10H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}

function DataSourceIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4.5" rx="5.5" ry="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 4.5V8C2.5 9.1 5 10 8 10S13.5 9.1 13.5 8V4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 8V11.5C2.5 12.6 5 13.5 8 13.5S13.5 12.6 13.5 11.5V8" stroke="currentColor" strokeWidth="1.3"/></svg>;
}

function ModelIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="9" width="3" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="6.5" y="5.5" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="11.5" y="1.5" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>;
}

function AuditIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4H13M3 8H10M3 12H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="13" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M15 13.5L14.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

function SettingsIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.2 3.2L4.3 4.3M11.7 11.7L12.8 12.8M3.2 12.8L4.3 11.7M11.7 4.3L12.8 3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

function HelpIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7 9 7.5 8 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="11" r="0.75" fill="currentColor"/></svg>;
}
