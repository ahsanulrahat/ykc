import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // 1. Verify webhook secret key for security
    const webhookSecret = process.env.FB_WEBHOOK_SECRET || "ykc_fb_webhook_secure_key_2026";
    if (secret !== webhookSecret) {
      return NextResponse.json(
        { error: "Unauthorized access: Invalid secret key" },
        { status: 401 }
      );
    }

    // 2. Parse payload
    const body = await request.json();
    const { id, message, image_url, created_time, link } = body;

    if (!id || !message) {
      return NextResponse.json(
        { error: "Invalid payload: id and message are required" },
        { status: 400 }
      );
    }

    // 3. Transform Facebook post data to blog post format
    const cleanMessage = message.trim();
    
    // Extract first line or first 70 characters as the title
    const firstLine = cleanMessage.split("\n")[0].trim();
    const title = firstLine.length > 70 
      ? firstLine.substring(0, 67) + "..." 
      : firstLine || "ফেসবুক আপডেট";

    // Generate excerpt
    const excerpt = cleanMessage.length > 180 
      ? cleanMessage.substring(0, 177) + "..." 
      : cleanMessage;

    // Format date nicely
    const postDate = created_time 
      ? new Date(created_time).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    const slug = `fb-${id}`;
    
    // Format full content (appending link to Facebook if available)
    let content = cleanMessage;
    if (link) {
      content += `\n\n---\n[মূল পোস্টটি ফেসবুকে দেখুন](${link})`;
    }

    const blogPost = {
      title,
      slug,
      excerpt,
      content,
      image: image_url || "/assets/post-win-election.jpeg", // Default fallback image
      date: postDate,
      author: "Yaser Khan Chowdhury",
      facebook_id: id,
      updatedAt: new Date(),
    };

    // 4. Upsert (insert or update) post in MongoDB using the slug as a unique identifier
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection("posts").updateOne(
      { slug: slug },
      { 
        $set: blogPost,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    // Trigger on-demand cache revalidation for pre-rendered pages
    try {
      revalidatePath("/blog");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Facebook post synced successfully",
      slug: slug,
      upsertedId: result.upsertedId || null,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });

  } catch (err) {
    console.error("Facebook webhook sync error:", err);
    return NextResponse.json(
      { error: "Internal server error processing webhook payload" },
      { status: 500 }
    );
  }
}
