import type { ComputedZone } from '../useZones';
import { currency } from '../useZones';

interface Props {
  computed: ComputedZone[];
  coverZone: (id: string) => void;
}

export default function ZonePanel({ computed, coverZone }: Props) {
  const activeSorted = [...computed].filter((z) => !z.covered).sort((a, b) => b.value - a.value);
  const topId = activeSorted[0]?.id ?? null;
  const coveredZone = computed.find((z) => z.covered);

  return (
    <div className="panel">
      <h2>Predicted zones — ranked by ₹ recoverable</h2>
      <p className="sub">₹ value = P(cash-out here) × amount still traceable × chance a raid still stops it in time</p>

      {computed.map((z) => {
        const urgent = z.windowLeftMin <= 15;
        return (
          <div key={z.id} className={`zone ${z.covered ? 'covered' : ''} ${z.id === topId ? 'top-value' : ''}`}>
            <div className="zone-top">
              <span className="zone-name">{z.name}</span>
              <span className="zone-value">{z.covered ? '—' : currency(z.value)}</span>
            </div>
            <div className="zone-meta">
              <span>confidence <span className="mono">{Math.round(z.normProb * 100)}%</span></span>
              <span>window left <span className="mono">{z.windowLeftMin} min</span></span>
            </div>
            <span className={`zone-badge ${urgent ? 'badge-urgent' : 'badge-ok'}`}>
              {urgent ? 'window closing' : 'window open'}
            </span>
            <br />
            <button disabled={z.covered} onClick={() => coverZone(z.id)}>
              {z.covered ? 'Covered' : 'Mark as covered by field unit'}
            </button>
          </div>
        );
      })}

      {coveredZone && activeSorted[0] && (
        <div className="reroute-note">
          Rerouted: with {coveredZone.name.split(' — ')[0]} covered, {activeSorted[0].name.split(' — ')[0]} is now
          the highest ₹-value target ({currency(activeSorted[0].value)}).
        </div>
      )}
    </div>
  );
}
