// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  await removeAuthCookie(); // Add await
  return NextResponse.json({ success: true });
}