import { Coordinates, ElevationResult } from '@/types/assessment';
import { fetchWithTimeout } from './http';

export async function getSiteElevation({ lat, lng }: Coordinates): Promise<ElevationResult | null> {
  const url = `https://epqs.nationalmap.gov/v1/json?x=${lng}&y=${lat}&wkid=4326&units=Feet&includeDate=false`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const elevation = data?.value;
  if (elevation == null) return null;

  return { elevationFeet: Number(elevation) };
}
