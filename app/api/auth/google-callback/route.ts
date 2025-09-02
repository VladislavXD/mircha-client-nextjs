import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, avatarUrl, googleId } = await request.json()

    // Отправляем запрос на Express API для получения токена
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

    const { user, token } = await response.json()

    // Возвращаем пользователя и токен для сохранения в Redux
    return NextResponse.json({ user, token })
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.json(
      { error: 'Failed to process Google authentication' },
      { status: 500 }
    )
  }
}
