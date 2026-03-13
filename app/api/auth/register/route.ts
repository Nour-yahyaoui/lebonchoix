// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();
    
    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} OR username = ${username}
    `;
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }
    
    // Create user
    const hashedPassword = await hashPassword(password);
    
    const [user] = await sql`
      INSERT INTO users (email, username, password)
      VALUES (${email}, ${username}, ${hashedPassword})
      RETURNING id, email, username
    `;
    
    // Create token
    const token = createToken({ id: user.id, email: user.email });
    
    // Set HTTP-only cookie
    setAuthCookie(token);
    
    return NextResponse.json({
      user,
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}