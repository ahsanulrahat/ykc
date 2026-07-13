import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    // 2. Determine the host to call our own sync endpoint
    // In Vercel, VERCEL_URL is provided, or we can use NEXT_PUBLIC_SITE_URL
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}`;
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    // 3. Call the actual sync endpoint with the webhook secret
    const webhookSecret = process.env.FB_WEBHOOK_SECRET || "ykc_fb_webhook_secure_key_2026";
    const syncUrl = `${baseUrl}/api/sync-facebook?secret=${webhookSecret}&isCron=true`;
    
    console.log(`Cron triggering sync at: ${syncUrl}`);

    const syncResponse = await fetch(syncUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Vercel-Cron/1.0"
      }
    });

    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      throw new Error(`Sync endpoint failed with status ${syncResponse.status}: ${errorText}`);
    }

    const result = await syncResponse.json();

    return NextResponse.json({
      success: true,
      message: "Cron sync executed successfully",
      details: result
    });

  } catch (err: any) {
    console.error("Cron sync error:", err);
    return NextResponse.json(
      { error: "Internal server error during cron execution", message: err.message },
      { status: 500 }
    );
  }
}
