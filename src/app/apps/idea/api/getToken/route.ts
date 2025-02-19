import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Store in environment variables
        app_id: process.env.APP_ID,
        app_secret: process.env.APP_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      app_access_token: data.app_access_token,
      expire: data.expire,
    });

  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}