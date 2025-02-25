export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "10", 10);
  const pageToken = searchParams.get("page_token") || ""; // Ambil token halaman jika ada

  try {
    // Step 1: Fetch Token
    const tokenResponse = await fetch(new URL('/apps/idea/api/getToken', req.nextUrl.origin));
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(`Failed to fetch token: ${tokenData.error || tokenResponse.status}`);
    const accessToken = tokenData.app_access_token;

    // Step 2: Fetch Data dari API LarkSuite
    const apiUrl = new URL(`https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records`);
    apiUrl.searchParams.append("page_size", pageSize.toString());
    if (pageToken) apiUrl.searchParams.append("page_token", pageToken); // Tambahkan page_token jika ada

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const records = await response.json();

    console.log('List Record : ', records);

    return NextResponse.json({
      data: {
        items: records.data.items, // Tidak perlu slice, ambil dari API langsung
        total: records.data.total, // Total data dari API
        has_more: records.data.has_more, // Cek apakah masih ada data
        next_page_token: records.data.page_token || null, // Token untuk halaman selanjutnya
      },
    });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}
