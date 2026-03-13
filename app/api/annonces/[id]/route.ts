// app/api/annonces/[id]/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if this is a preload request (optional)
    const isPreload = request.headers.get('Purpose') === 'prefetch' || 
                      request.headers.get('X-Moz') === 'prefetch';

    // Only count views for actual user visits, not preloads
    if (!isPreload) {
      await sql`
        UPDATE items 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${id}::uuid
      `;
    }

    // Get annonce details
    const result = await sql`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.price,
        i.created_at,
        i.views,
        i.user_id,
        c.name as category_name,
        c.slug as category_slug,
        d.name as delegation_name,
        g.name as governorate_name,
        i.address,
        (
          SELECT COALESCE(json_agg(image_url), '[]'::json) 
          FROM item_images 
          WHERE item_id = i.id
        ) as images,
        u.username as user_name,
        u.email as user_email
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN delegations d ON i.delegation_id = d.id
      LEFT JOIN governorates g ON d.governorate_id = g.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = ${id}::uuid
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Annonce not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch annonce:', error);
    return NextResponse.json({ error: 'Failed to fetch annonce' }, { status: 500 });
  }
}