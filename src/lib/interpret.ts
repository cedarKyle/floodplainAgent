import { InterpretedAssessment } from '@/types/assessment';
import { fetchWithTimeout } from './http';

const systemPrompt = `You are Cedar's floodplain risk assessment agent. You are an expert in FEMA flood regulations, local floodplain ordinances, and their impact on real estate development feasibility.

You receive raw data from FEMA's NFHL, USGS elevation services, and geocoding services. Your job is to interpret this data and deliver an opinionated, actionable development risk assessment.

Return strict JSON with the required schema and no markdown.`;

export async function interpretAssessment(rawData: unknown): Promise<InterpretedAssessment> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('missing_api_key');

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1800,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content:
              `Interpret this floodplain data and return JSON only. Ensure the exact required keys are present:\n${JSON.stringify(rawData, null, 2)}`
          }
        ]
      })
    },
    10000
  );

  if (!response.ok) throw new Error('anthropic_failed');
  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error('anthropic_empty');
  return JSON.parse(text) as InterpretedAssessment;
}
