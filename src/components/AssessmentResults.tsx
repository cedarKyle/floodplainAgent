import { AssessmentResponse } from '@/types/assessment';
import { DevelopmentImpactCard } from './DevelopmentImpactCard';
import { FloodZoneCard } from './FloodZoneCard';
import { JurisdictionCard } from './JurisdictionCard';
import { NextStepsCard } from './NextStepsCard';
import { RawDataAccordion } from './RawDataAccordion';
import { SeverityBadge } from './SeverityBadge';

export function AssessmentResults({ result }: { result: AssessmentResponse }) {
  if (!result.assessment) return null;
  return (
    <div className="mt-8 space-y-4">
      <section className="card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-cedar-muted">Assessment for</p>
            <h2 className="text-xl font-semibold">{result.address}</h2>
            <p className="mt-2 text-lg">{result.assessment.headline}</p>
          </div>
          <SeverityBadge severity={result.assessment.severity} />
        </div>
      </section>

      <FloodZoneCard floodZone={result.assessment.flood_zone} />
      <DevelopmentImpactCard impact={result.assessment.development_impact} />
      <JurisdictionCard jurisdiction={result.assessment.jurisdiction} />
      <NextStepsCard steps={result.assessment.next_steps} />
      <RawDataAccordion data={result} />
    </div>
  );
}
