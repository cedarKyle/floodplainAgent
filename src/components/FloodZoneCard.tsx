import { InterpretedAssessment } from '@/types/assessment';

export function FloodZoneCard({ floodZone }: { floodZone: InterpretedAssessment['flood_zone'] }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Flood Zone</h2>
      <p className="text-xl font-bold">{floodZone.code} — {floodZone.name}</p>
      <p className="mt-2 text-cedar-muted">{floodZone.description}</p>
    </section>
  );
}
