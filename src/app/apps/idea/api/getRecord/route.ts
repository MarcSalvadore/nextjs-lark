import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
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
            return NextResponse.json({ error: "Missing record_id parameter" }, { status: 400 });
        }

        const response = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/${record_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // If required
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error("Error fetching record:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
