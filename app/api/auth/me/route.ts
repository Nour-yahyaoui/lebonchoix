// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerUser, getAuthToken } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getServerUser(); 
    
    if (!auth) {
      return NextResponse.json({ user: null });
    }
    
    const [user] = await sql`
      SELECT id, email, username, avatar
      FROM users
      WHERE id = ${auth.id} 
    `;
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    const token = await getAuthToken();
    
    return NextResponse.json({ 
      user,
      token
    });
    
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ user: null });
  }
}