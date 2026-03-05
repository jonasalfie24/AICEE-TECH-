import { NextRequest, NextResponse } from 'next/server'

// Mock user data - in production, fetch from database using token
const mockUserData = {
  '1': {
    id: '1',
    email: 'student@example.com',
    username: 'student',
    first_name: 'John',
    last_name: 'Doe',
    role: 'student' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '2': {
    id: '2',
    email: 'admin@example.com',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1] || request.cookies.get('aicee-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      )
    }

    // Decode token (simplified - in production, use proper JWT verification)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      const user = mockUserData[decoded.id as keyof typeof mockUserData]

      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user, { status: 200 })
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
