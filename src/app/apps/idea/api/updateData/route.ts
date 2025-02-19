import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { // Ensure PATCH is defined
    const { searchParams } = new URL(req.url);
    const record_id = searchParams.get("record_id");

    if (!record_id) {
        return NextResponse.json({ error: "Missing record_id" }, { status: 400 });
    }

    const requestBody = await req.json(); // Read JSON body correctly

    try {
        const tokenResponse = await fetch(new URL('/apps/idea/api/getToken', req.nextUrl.origin));
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.app_access_token;

        console.log('Fetched Access Token:', accessToken);

        const response = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/batch_update`, {
            method: "POST", // Ensure this matches frontend
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody), // Send correct request body
        });

        // if (!response.ok) {
        //     throw new Error(`Failed to update record: ${response.statusText}`);
        // }

        return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}