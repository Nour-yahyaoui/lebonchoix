// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { comparePassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const users = await sql`
      SELECT id, email, username, password 
      FROM users 
      WHERE email = ${email}
    `;
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const user = users[0];
    const valid = await comparePassword(password, user.password);
    
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = createToken({ id: user.id, email: user.email });
    
    // This sets the HTTP-only cookie
    await setAuthCookie(token);
    
    const { password: _, ...userWithoutPass } = user;
    
    return NextResponse.json({ user: userWithoutPass, token });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}