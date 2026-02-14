export function NextStepsCard({ steps }: { steps: string[] }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-lg font-semibold">Recommended Next Steps</h2>
      <ol className="ml-5 list-decimal space-y-2">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
