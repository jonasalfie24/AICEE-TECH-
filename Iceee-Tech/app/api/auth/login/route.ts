import { NextRequest, NextResponse } from 'next/server'

// Mock user database - replace with actual database calls
const mockUsers = [
  {
    id: '1',
    email: 'student@example.com',
    username: 'student',
    password: 'password123', // In production, this would be hashed
    first_name: 'John',
    last_name: 'Doe',
    role: 'student' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@example.com',
    username: 'admin',
    password: 'admin123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email or username
    const user = mockUsers.find(
      u => (u.email === email || u.username === email) && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email/username or password' },
        { status: 401 }
      )
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { message: `Account is ${user.status}. Please contact admin.` },
        { status: 403 }
      )
    }

    // Create JWT token (simplified - use proper JWT library in production)
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64')

    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      { status: 200 }
    )

    response.cookies.set('aicee-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
