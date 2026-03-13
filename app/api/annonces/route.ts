// app/api/annonces/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const locationId = searchParams.get("locationId");
  const q = searchParams.get("q");

  try {
    let query = sql`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.price,
        i.created_at,
        COALESCE(i.views, 0) as views,
        c.name as category_name,
        c.slug as category_slug,
         d.id as delegation_id,        -- Add this
    g.id as governorate_id,       -- Add this
        d.name as delegation_name,
        g.name as governorate_name,
        i.address,
        (
          SELECT COALESCE(json_agg(image_url), '[]'::json) 
          FROM item_images 
          WHERE item_id = i.id
        ) as images,
        (
          SELECT image_url 
          FROM item_images 
          WHERE item_id = i.id 
          ORDER BY is_primary DESC NULLS LAST, created_at ASC 
          LIMIT 1
        ) as image_url
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN delegations d ON i.delegation_id = d.id
      LEFT JOIN governorates g ON d.governorate_id = g.id
      WHERE 1=1
    `;

    if (category) {
      query = sql`${query} AND c.slug = ${category}`;
    }

    if (locationId) {
      query = sql`${query} AND (i.delegation_id = ${locationId}::uuid OR d.governorate_id = ${locationId}::uuid)`;
    }

    if (q) {
      const searchQuery = `%${q}%`;
      query = sql`${query} AND (
        i.title ILIKE ${searchQuery} OR 
        i.description ILIKE ${searchQuery}
      )`;
    }

    query = sql`${query} ORDER BY i.created_at DESC LIMIT 50`;

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch annonces:", error);
    return NextResponse.json([]);
  }
}
