// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');
  const type = searchParams.get('type');

  if (!locationId) {
    return NextResponse.json({ error: 'Location ID required' }, { status: 400 });
  }

  try {
    let stats;
    
    if (type === 'governorate') {
      stats = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'houses') THEN 1 END) as houses,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'apartments') THEN 1 END) as apartments,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'cars') THEN 1 END) as cars,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'land') THEN 1 END) as lands,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'commercial') THEN 1 END) as commercial
        FROM items i
        JOIN delegations d ON i.delegation_id = d.id
        WHERE d.governorate_id = ${locationId}::uuid
      `;
    } else {
      stats = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'houses') THEN 1 END) as houses,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'apartments') THEN 1 END) as apartments,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'cars') THEN 1 END) as cars,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'land') THEN 1 END) as lands,
          COUNT(CASE WHEN category_id = (SELECT id FROM categories WHERE slug = 'commercial') THEN 1 END) as commercial
        FROM items
        WHERE delegation_id = ${locationId}::uuid
      `;
    }

    return NextResponse.json(stats[0] || {
      total: 0,
      houses: 0,
      apartments: 0,
      cars: 0,
      lands: 0,
      commercial: 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}