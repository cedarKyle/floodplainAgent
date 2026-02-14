export type Severity = 'GREEN' | 'YELLOW' | 'RED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  matchedAddress: string;
  coordinates: Coordinates;
}

export interface FemaZoneResult {
  floodZone: string;
  zoneSubtype: string | null;
  sfha: boolean;
  staticBfe: number | null;
  depth: number | null;
  velocity: number | null;
  sourceCitation: string | null;
}

export interface BfeLineResult {
  elevation: number;
  unit: string | null;
  datum: string | null;
  sourceCitation: string | null;
}

export interface ElevationResult {
  elevationFeet: number;
}

export interface JurisdictionResult {
  county: string | null;
  stateCode: string | null;
  city: string | null;
  displayName: string;
  isAustin: boolean;
}

export interface InterpretedAssessment {
  severity: Severity;
  headline: string;
  flood_zone: {
    code: string;
    name: string;
    description: string;
  };
  development_impact: {
    foundation: string;
    finished_floor: string;
    cost_premium: string;
    insurance: string;
    prohibited_uses: string;
  };
  jurisdiction: {
    name: string;
    is_austin: boolean;
    local_requirements: string[];
    key_warning: string;
  };
  next_steps: string[];
  raw_data_summary: {
    coordinates: Coordinates;
    fema_zone: string;
    sfha: boolean;
    bfe: number | null;
    site_elevation: number | null;
    freeboard: number | null;
  };
}

export interface AssessmentResponse {
  ok: boolean;
  address: string;
  progressLog: string[];
  warnings: string[];
  geocode?: GeocodeResult;
  fema?: FemaZoneResult;
  nearbyBfeLines?: BfeLineResult[];
  elevation?: ElevationResult;
  jurisdiction?: JurisdictionResult;
  assessment?: InterpretedAssessment;
  userMessage?: string;
}
