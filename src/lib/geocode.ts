import { GeocodeResult } from '@/types/assessment';
import { fetchWithTimeout } from './http';

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodedAddress}&benchmark=Public_AR_Current&format=json`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const match = data?.result?.addressMatches?.[0];
  if (!match?.coordinates) return null;

  return {
    matchedAddress: match.matchedAddress ?? address,
    coordinates: {
      lat: Number(match.coordinates.y),
      lng: Number(match.coordinates.x)
    }
  };
}
