import { NextRequest, NextResponse } from 'next/server'

// Mock user database
let registeredUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, first_name, last_name } = await request.json()

    if (!email || !username || !password || !first_name || !last_name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (registeredUsers.find(u => u.email === email || u.username === username)) {
      return NextResponse.json(
        { message: 'Email or username already exists' },
        { status: 409 }
      )
    }

    // Create new user with pending_approval status
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username,
      password, // In production, hash this with bcrypt
      first_name,
      last_name,
      role: 'student',
      status: 'pending_approval',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    registeredUsers.push(newUser)

    // In production, send confirmation email here
    console.log('New registration:', newUser)

    return NextResponse.json(
      {
        message: 'Registration successful. Please wait for admin approval.',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
          status: newUser.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
