import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, avatarUrl, googleId } = await request.json()

    // Отправляем запрос на ваш Express API
    const response = await fetch(`${process.env.EXPRESS_API_URL}/api/auth/google-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        avatarUrl,
        googleId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to sync user with database')
    }

    const userData = await response.json()

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Google sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
