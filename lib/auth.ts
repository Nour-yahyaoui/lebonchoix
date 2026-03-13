// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function createToken(user: { id: string; email: string }) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function getServerUser() {
  try {
    const token = await getAuthToken();
    if (!token) return null;
    
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}