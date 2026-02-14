import { InterpretedAssessment } from '@/types/assessment';

function Row({ label, value }: { label: string; value: string }) {
  const dealbreaker = /(prohibit|not feasible|impractical|severe|dealbreaker)/i.test(value);
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-cedar-border py-3 last:border-b-0">
      <dt className="text-sm font-semibold text-cedar-muted">{label}</dt>
      <dd className={dealbreaker ? 'text-cedar-red' : ''}>{value}</dd>
    </div>
  );
}

export function DevelopmentImpactCard({ impact }: { impact: InterpretedAssessment['development_impact'] }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Development Impact</h2>
      <dl>
        <Row label="Foundation" value={impact.foundation} />
        <Row label="Finished Floor" value={impact.finished_floor} />
        <Row label="Cost Premium" value={impact.cost_premium} />
        <Row label="Insurance" value={impact.insurance} />
        <Row label="Prohibited Uses" value={impact.prohibited_uses} />
      </dl>
    </section>
  );
}
