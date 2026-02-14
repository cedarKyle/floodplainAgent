import { BfeLineResult, Coordinates, FemaZoneResult } from '@/types/assessment';
import { fetchWithTimeout } from './http';

export async function getFemaFloodZone({ lat, lng }: Coordinates): Promise<FemaZoneResult | null> {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    spatialRel: 'esriSpatialRelIntersects',
    outFields:
      'FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE,DEPTH,V_DATUM,LEN_UNIT,VELOCITY,VEL_UNIT,AR_REVERT,AR_SUBTRV,BFE_REVERT,DEP_REVERT,DUAL_ZONE,SOURCE_CIT',
    returnGeometry: 'false',
    f: 'json'
  });

  const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?${params.toString()}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const attrs = data?.features?.[0]?.attributes;
  if (!attrs) return null;

  return {
    floodZone: attrs.FLD_ZONE ?? 'Unknown',
    zoneSubtype: attrs.ZONE_SUBTY ?? null,
    sfha: String(attrs.SFHA_TF).toUpperCase() === 'T' || attrs.SFHA_TF === true || attrs.SFHA_TF === 1,
    staticBfe: attrs.STATIC_BFE != null ? Number(attrs.STATIC_BFE) : null,
    depth: attrs.DEPTH != null ? Number(attrs.DEPTH) : null,
    velocity: attrs.VELOCITY != null ? Number(attrs.VELOCITY) : null,
    sourceCitation: attrs.SOURCE_CIT ?? null
  };
}

export async function getNearbyBfeLines({ lat, lng }: Coordinates): Promise<BfeLineResult[]> {
  const params = new URLSearchParams({
    geometry: `${lng - 0.001},${lat - 0.001},${lng + 0.001},${lat + 0.001}`,
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'ELEV,LEN_UNIT,V_DATUM,SOURCE_CIT',
    returnGeometry: 'false',
    f: 'json'
  });

  const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/16/query?${params.toString()}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return [];

  const data = await response.json();
  const features = data?.features ?? [];
  return features
    .map((feature: { attributes?: Record<string, unknown> }) => feature.attributes)
    .filter((attrs: Record<string, unknown> | undefined) => attrs?.ELEV != null)
    .map((attrs: Record<string, unknown>) => ({
      elevation: Number(attrs.ELEV),
      unit: attrs.LEN_UNIT ? String(attrs.LEN_UNIT) : null,
      datum: attrs.V_DATUM ? String(attrs.V_DATUM) : null,
      sourceCitation: attrs.SOURCE_CIT ? String(attrs.SOURCE_CIT) : null
    }));
}
