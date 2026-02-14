import { AssessmentResponse } from '@/types/assessment';

export function RawDataAccordion({ data }: { data: AssessmentResponse }) {
  return (
    <details className="card">
      <summary className="cursor-pointer text-sm font-semibold text-cedar-blue">Raw Data (Power Users)</summary>
      <pre className="mt-3 overflow-auto rounded bg-black/30 p-3 text-xs">{JSON.stringify({
        coordinates: data.assessment?.raw_data_summary.coordinates,
        fema_zone: data.assessment?.raw_data_summary.fema_zone,
        sfha: data.assessment?.raw_data_summary.sfha,
        bfe: data.assessment?.raw_data_summary.bfe,
        site_elevation: data.assessment?.raw_data_summary.site_elevation,
        freeboard: data.assessment?.raw_data_summary.freeboard,
        warnings: data.warnings
      }, null, 2)}</pre>
    </details>
  );
}
