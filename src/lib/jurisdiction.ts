import { Coordinates, JurisdictionResult } from '@/types/assessment';
import { fetchWithTimeout } from './http';

export async function getJurisdiction({ lat, lng }: Coordinates): Promise<JurisdictionResult | null> {
  const url = `https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lng}&format=json`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const county = data?.results?.[0]?.county_name ? String(data.results[0].county_name) : null;
  const stateCode = data?.results?.[0]?.state_code ? String(data.results[0].state_code) : null;
  const city = data?.results?.[0]?.county_subdivision_name
    ? String(data.results[0].county_subdivision_name)
    : null;

  const isAustin =
    stateCode?.toUpperCase() === 'TX' &&
    (city?.toLowerCase().includes('austin') || data?.results?.[0]?.county_name?.toLowerCase().includes('travis'));

  return {
    county,
    stateCode,
    city,
    displayName: [city, county, stateCode].filter(Boolean).join(', ') || 'Unknown jurisdiction',
    isAustin: Boolean(isAustin)
  };
}
