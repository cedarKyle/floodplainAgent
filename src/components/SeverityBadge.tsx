import { Severity } from '@/types/assessment';

const styles: Record<Severity, string> = {
  GREEN: 'bg-cedar-green/20 text-cedar-green border-cedar-green/30',
  YELLOW: 'bg-cedar-yellow/20 text-cedar-yellow border-cedar-yellow/30',
  RED: 'bg-cedar-red/20 text-cedar-red border-cedar-red/30'
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`inline-flex rounded-full border px-4 py-1 text-sm font-bold tracking-wide ${styles[severity]}`}>{severity}</span>;
}
