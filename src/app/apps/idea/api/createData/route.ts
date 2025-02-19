import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Ensure the request is a POST request with JSON
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Step 2: Parse JSON body
    const body = await req.json();
    console.log("Received Data:", body);

    // Step 3: Validate incoming request body
    if (!body.records || !Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    // Step 4: Fetch token authorization
    const tokenResponse = await fetch(new URL("/apps/idea/api/getToken", req.nextUrl.origin));
    
    if (!tokenResponse.ok) {
      const errorMessage = await tokenResponse.text();
      throw new Error(`Failed to fetch token: ${tokenResponse.status} - ${errorMessage}`);
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.app_access_token) {
      throw new Error("Token response is missing 'app_access_token'");
    }

    const accessToken = tokenData.app_access_token;
    console.log("Fetched Access Token:", accessToken);

    // Step 5: Send data to LarkSuite API
    const response = await fetch(
      "https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/batch_create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    // Step 6: Handle response from LarkSuite
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LarkSuite API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
