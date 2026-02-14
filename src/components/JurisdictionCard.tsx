import { InterpretedAssessment } from '@/types/assessment';

export function JurisdictionCard({ jurisdiction }: { jurisdiction: InterpretedAssessment['jurisdiction'] }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Jurisdiction Requirements</h2>
      <p className="mb-2 text-sm text-cedar-muted">{jurisdiction.name}</p>
      <ul className="ml-5 list-disc space-y-2">
        {jurisdiction.local_requirements.map((req) => (
          <li key={req}>{req}</li>
        ))}
      </ul>
      <div className="mt-4 rounded-md border border-cedar-red/40 bg-cedar-red/10 p-3 text-sm">
        <span className="font-semibold text-cedar-red">Key Warning:</span> {jurisdiction.key_warning}
      </div>
      {jurisdiction.is_austin ? (
        <div className="mt-3 rounded-md border border-cedar-green/40 bg-cedar-green/10 p-3 text-sm">
          Austin CRS Class 5 provides up to a 25% flood insurance discount in SFHAs.
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-cedar-yellow/40 bg-cedar-yellow/10 p-3 text-sm text-cedar-yellow">
          Local requirements not yet available for this jurisdiction — verify with the municipal floodplain administrator.
        </div>
      )}
    </section>
  );
}
