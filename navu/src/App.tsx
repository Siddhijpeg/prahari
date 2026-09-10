import { useZones, currency, AMOUNT_REMAINING } from './useZones';
import ZonePanel from './components/ZonePanel';
import CaseBrief from './components/CaseBrief';
import ApprovalPanel from './components/ApprovalPanel';

export default function App() {
  const { computeValues, coverZone } = useZones();
  const computed = computeValues();
  const topZone = [...computed].filter((z) => !z.covered).sort((a, b) => b.value - a.value)[0];

  return (
    <>
      <header>
        <div className="brand">
          <h1>Navu</h1>
          <span>Cash-Out Intervention Console — mock demo, no live data</span>
        </div>
        <p className="tagline">
          Confidence tells you where. Intervention value tells you whether it's worth acting on right now.
        </p>
      </header>

      <div className="complaint-bar">
        <div className="field">Complaint <b className="mono">CMP-2031</b></div>
        <div className="field">Fraud type <b>Loan-app scam</b></div>
        <div className="field">Amount reported <b className="mono">₹85,000</b></div>
        <div className="field">Amount still traceable <b className="mono">{currency(AMOUNT_REMAINING)}</b></div>
        <div className="field">Filed <b className="mono">11:42 AM</b></div>
      </div>

      <div className="layout">
        <ZonePanel computed={computed} coverZone={coverZone} />
        <CaseBrief />
        <ApprovalPanel topZone={topZone} />
      </div>

      <footer>
        All names, accounts and amounts on this screen are illustrative demo data. Built for internal-round
        walkthrough — not connected to any live system.
      </footer>
    </>
  );
}
