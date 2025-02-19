export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Step 1: Fetch the access token from your own API
    const tokenResponse = await fetch(new URL('/apps/idea/api/getToken', req.nextUrl.origin));
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenData.error || tokenResponse.status}`);
    }

    const accessToken = tokenData.app_access_token;
    console.log('Fetched Access Token:', accessToken);

    // Step 2: Fetch data from LarkSuite API using the token
    const response = await fetch(
      'https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Pass the token here
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}