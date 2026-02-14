'use client';

import { FormEvent, useState } from 'react';
import { AssessmentResponse } from '@/types/assessment';
import { AssessmentResults } from './AssessmentResults';

const STEPS = [
  'Geocoding address...',
  'Querying FEMA flood zones...',
  'Checking base flood elevation...',
  'Getting site elevation...',
  'Analyzing jurisdiction requirements...',
  'Generating assessment...'
];

export function AddressInput() {
  const [address, setAddress] = useState('600 Congress Ave, Austin, TX 78701');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setStepIndex(0);

    const ticker = setInterval(() => setStepIndex((s) => (s + 1) % STEPS.length), 1100);

    try {
      const response = await fetch('/api/assess-floodplain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const payload = (await response.json()) as AssessmentResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.userMessage || 'Unable to run floodplain assessment.');
      }
      setResult(payload);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to run floodplain assessment.');
    } finally {
      clearInterval(ticker);
      setLoading(false);
      setStepIndex(0);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Cedar Floodplain Agent</h1>
      <p className="mt-2 text-cedar-muted">Autonomous floodplain risk analysis for development acquisition decisions.</p>
      <form className="mt-6 card" onSubmit={onSubmit}>
        <label className="mb-2 block text-sm font-medium">Street Address</label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full rounded-md border border-cedar-border bg-cedar-panelSoft px-3 py-2 outline-none focus:border-cedar-blue"
            placeholder="Enter a U.S. street address"
          />
          <button
            disabled={loading}
            className="rounded-md bg-cedar-blue px-5 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Running...' : 'Run Assessment'}
          </button>
        </div>
      </form>

      {loading && (
        <section className="card mt-4">
          <p className="text-sm text-cedar-muted">Agent progress</p>
          <p className="mt-2 font-medium">{STEPS[stepIndex]}</p>
        </section>
      )}

      {error && <section className="card mt-4 border-cedar-red text-cedar-red">{error}</section>}

      {result?.warnings?.length ? (
        <section className="card mt-4 border-cedar-yellow/50 bg-cedar-yellow/10 text-sm text-cedar-yellow">
          {result.warnings.map((w) => (
            <p key={w}>• {w}</p>
          ))}
        </section>
      ) : null}

      {result && <AssessmentResults result={result} />}
    </div>
  );
}
