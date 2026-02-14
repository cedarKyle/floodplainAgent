import { NextRequest, NextResponse } from 'next/server';
import { getSiteElevation } from '@/lib/elevation';
import { getNearbyBfeLines, getFemaFloodZone } from '@/lib/fema';
import { geocodeAddress } from '@/lib/geocode';
import { interpretAssessment } from '@/lib/interpret';
import { getJurisdiction } from '@/lib/jurisdiction';
import { AssessmentResponse } from '@/types/assessment';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { address?: string };
    const address = body?.address?.trim();
    if (!address) {
      return NextResponse.json({ ok: false, userMessage: 'Please enter a valid street address.' }, { status: 400 });
    }

    const progressLog: string[] = ['Geocoding address...'];
    const warnings: string[] = [];

    const geocode = await geocodeAddress(address);
    if (!geocode) {
      return NextResponse.json(
        {
          ok: false,
          address,
          progressLog,
          warnings,
          userMessage: 'Could not locate this address. Please check the format and try again.'
        } satisfies AssessmentResponse,
        { status: 422 }
      );
    }

    progressLog.push('Querying FEMA flood zones...');
    const fema = await getFemaFloodZone(geocode.coordinates);
    let nearbyBfeLines = [];
    if (!fema) {
      warnings.push('FEMA data is temporarily unavailable. Assessment is based on limited data.');
    } else if (fema.sfha) {
      progressLog.push('Checking base flood elevation...');
      nearbyBfeLines = await getNearbyBfeLines(geocode.coordinates);
    }

    progressLog.push('Getting site elevation...');
    const elevation = await getSiteElevation(geocode.coordinates);
    if (!elevation) {
      warnings.push('Site elevation data is unavailable. Freeboard could not be calculated.');
    }

    progressLog.push('Analyzing jurisdiction requirements...');
    const jurisdiction = await getJurisdiction(geocode.coordinates);
    if (!jurisdiction) {
      warnings.push('Jurisdiction lookup is unavailable. Using generic FEMA/NFIP guidance only.');
    }

    progressLog.push('Generating assessment...');

    const rawData = {
      address,
      matchedAddress: geocode.matchedAddress,
      coordinates: geocode.coordinates,
      fema,
      nearbyBfeLines,
      elevation,
      jurisdiction,
      warnings
    };

    let assessment;
    try {
      const bfeCandidate = fema?.staticBfe ?? nearbyBfeLines[0]?.elevation ?? null;
      const freeboard = elevation && bfeCandidate ? Number((elevation.elevationFeet - bfeCandidate).toFixed(2)) : null;
      assessment = await interpretAssessment({ ...rawData, derived: { bfeCandidate, freeboard } });
    } catch {
      warnings.push('AI interpretation is unavailable right now. Showing raw data summary instead.');
      const floodZoneCode = fema?.floodZone ?? 'Unknown';
      assessment = {
        severity: fema?.sfha ? 'YELLOW' : 'GREEN',
        headline: fema?.sfha
          ? 'The site appears to be in or near a regulated flood hazard area and needs detailed due diligence.'
          : 'No FEMA Special Flood Hazard Area detected from available data.',
        flood_zone: {
          code: floodZoneCode,
          name: floodZoneCode === 'X' ? 'Zone X (Minimal Risk)' : 'Flood Zone (See FEMA)',
          description: 'Automated interpretation unavailable. Review the raw data and verify with a floodplain professional.'
        },
        development_impact: {
          foundation: 'Confirm with floodplain engineer based on site-specific survey and local code.',
          finished_floor: 'Set finished floor elevation after confirming applicable BFE and freeboard rules.',
          cost_premium: 'Potential premium depends on final design and flood compliance requirements.',
          insurance: 'Flood insurance requirements depend on lender, flood zone, and finished floor elevation.',
          prohibited_uses: 'Confirm constraints with municipal floodplain administrator.'
        },
        jurisdiction: {
          name: jurisdiction?.displayName ?? 'Unknown jurisdiction',
          is_austin: Boolean(jurisdiction?.isAustin),
          local_requirements: jurisdiction?.isAustin
            ? [
                'Austin fully developed floodplain regulations may be more restrictive than FEMA maps.',
                'Floodplain Modification Permit may be required by Watershed Protection Department.',
                'No-fill policy and compensatory storage requirements can apply.'
              ]
            : ['Local requirements unavailable. Verify directly with municipal floodplain administrator.'],
          key_warning: jurisdiction?.isAustin
            ? 'Austin fully developed floodplain limits can constrain development even when FEMA maps appear permissive.'
            : 'Do not rely on federal FEMA data alone; verify local floodplain ordinances before land acquisition.'
        },
        next_steps: [
          'Order a survey and elevation certificate for the parcel.',
          'Confirm floodplain boundaries with local floodplain administrator.',
          'Engage a floodplain consultant before schematic design.',
          'Model mitigation costs in the development pro forma.'
        ],
        raw_data_summary: {
          coordinates: geocode.coordinates,
          fema_zone: floodZoneCode,
          sfha: Boolean(fema?.sfha),
          bfe: fema?.staticBfe ?? nearbyBfeLines[0]?.elevation ?? null,
          site_elevation: elevation?.elevationFeet ?? null,
          freeboard:
            elevation && (fema?.staticBfe ?? nearbyBfeLines[0]?.elevation)
              ? Number((elevation.elevationFeet - (fema?.staticBfe ?? nearbyBfeLines[0]?.elevation)).toFixed(2))
              : null
        }
      };
    }

    return NextResponse.json({
      ok: true,
      address,
      progressLog,
      warnings,
      geocode,
      fema,
      nearbyBfeLines,
      elevation,
      jurisdiction,
      assessment
    } satisfies AssessmentResponse);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        userMessage: 'The assessment service is temporarily unavailable. Please try again.'
      },
      { status: 500 }
    );
  }
}
