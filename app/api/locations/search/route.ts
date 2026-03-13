// app/api/locations/search/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const locations = await sql`
      SELECT 
        id,
        name,
        name_ar,
        'governorate' as type,
        NULL as parent_name
      FROM governorates
      WHERE name ILIKE ${'%' + query + '%'} 
         OR name_ar ILIKE ${'%' + query + '%'}
      
      UNION ALL
      
      SELECT 
        d.id,
        d.name,
        d.name_ar,
        'delegation' as type,
        g.name as parent_name
      FROM delegations d
      JOIN governorates g ON d.governorate_id = g.id
      WHERE d.name ILIKE ${'%' + query + '%'} 
         OR d.name_ar ILIKE ${'%' + query + '%'}
      
      UNION ALL
      
      SELECT 
        l.id,
        l.name,
        l.name_ar,
        'locality' as type,
        d.name as parent_name
      FROM localities l
      JOIN delegations d ON l.delegation_id = d.id
      WHERE l.name ILIKE ${'%' + query + '%'} 
         OR l.name_ar ILIKE ${'%' + query + '%'}
      
      LIMIT 20
    `;

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}