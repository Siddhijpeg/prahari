import { useState } from 'react';
import type { ComputedZone } from '../useZones';
import { currency } from '../useZones';

interface LogEntry {
  ts: string;
  text: string;
}

interface Props {
  topZone: ComputedZone | undefined;
}

export default function ApprovalPanel({ topZone }: Props) {
  const [drafted, setDrafted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function timestamp() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function addLog(text: string) {
    setLog((prev) => [{ ts: timestamp(), text }, ...prev]);
  }

  function draftAlert() {
    setDrafted(true);
    addLog('Alert drafted by Analyst (R. Sharma) — awaiting supervisor approval.');
  }

  function approveAlert() {
    setApproved(true);
    addLog('Approved by Supervisor (K. Verma) — alert sent to district unit. Model version risk-model v0.4.2 · registry v1.1.');
  }

  return (
    <div className="panel">
      <h2>Approval &amp; audit trail</h2>
      <p className="sub">No score becomes an action without a human sign-off, logged</p>

      <button className="step-btn" disabled={drafted} onClick={draftAlert}>
        Analyst: draft alert for top zone →
      </button>

      {drafted && (
        <div className="draft-box">
          <div className="row"><b>Target zone:</b> {topZone ? `${topZone.name} — ${currency(topZone.value)}` : 'none remaining'}</div>
          <div className="row"><b>Model version:</b> risk-model v0.4.2 · registry v1.1</div>
          <div className="row"><b>Reason:</b> highest ₹-recoverable zone at time of draft</div>
          <div className="row"><b>Drafted by:</b> Analyst — R. Sharma</div>
        </div>
      )}

      <button className="step-btn" disabled={!drafted || approved} onClick={approveAlert}>
        Supervisor: approve &amp; send →
      </button>

      <p className="sub" style={{ marginTop: 16, marginBottom: 8 }}>Audit log</p>
      <div>
        {log.length === 0 && <div className="log-empty">No actions logged yet.</div>}
        {log.map((entry, i) => (
          <div className="log-entry" key={i}>
            <div className="ts">{entry.ts}</div>
            <div className="action">{entry.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
