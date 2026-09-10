export default function CaseBrief() {
  return (
    <div className="panel">
      <h2>Case brief</h2>
      <p className="sub">Deterministic — built from stored factors, not generated text</p>

      <div className="brief-line">
        <div className="dot" />
        <div>Typology match: 4 past <b>loan-app scam</b> cases followed the same 2-hop pattern into this district cluster.</div>
      </div>
      <div className="brief-line">
        <div className="dot" />
        <div>Hop 2 account (<span className="mono">XXXX-4471</span>) has appeared in <b>3 other unrelated complaints</b> in the last 40 days.</div>
      </div>
      <div className="brief-line">
        <div className="dot" />
        <div>Transfer-to-cash-out gap for this typology is historically <b>22–70 minutes</b> — this case is at minute 26.</div>
      </div>

      <div className="missing-box">
        Missing to raise confidence: device/IP metadata on Hop 2 account, and confirmation the victim's bank has
        frozen the source account.
      </div>
    </div>
  );
}
