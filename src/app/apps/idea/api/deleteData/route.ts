import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const record_id = searchParams.get("record_id");

    const tokenResponse = await fetch(new URL('/apps/idea/api/getToken', req.nextUrl.origin));
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenData.error || tokenResponse.status}`);
    }

    const accessToken = tokenData.app_access_token;
    console.log('Fetched Access Token:', accessToken);

    if (!record_id) {
        return NextResponse.json({ error: "Missing record_id" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/${record_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Pass the token here
        },
        });

        if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
        }

        return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}