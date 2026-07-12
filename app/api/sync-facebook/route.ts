import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Retrieve page configurations from environment variables
    const pageId = process.env.FACEBOOK_PAGE_ID || "Nandailykc";
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { 
          error: "Facebook Access Token is missing.",
          instruction: "Please set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in your Vercel Environment Variables to run the sync."
        },
        { status: 400 }
      );
    }

    // 2. Fetch feed posts from official Meta Graph API
    const fbApiUrl = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,full_picture,created_time,permalink_url&limit=10&access_token=${accessToken}`;
    
    console.log(`Syncing from Facebook Page ID: ${pageId}...`);
    const response = await fetch(fbApiUrl);
    const data = await response.json();

    if (data.error) {
      console.error("Facebook API error:", data.error);
      return NextResponse.json(
        { error: "Facebook API returned an error", details: data.error },
        { status: 500 }
      );
    }

    const posts = data.data || [];
    if (posts.length === 0) {
      return NextResponse.json({ success: true, message: "No posts found to sync" });
    }

    // 3. Connect to DB and upsert posts
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("posts");

    let syncedCount = 0;

    for (const post of posts) {
      const { id, message, full_picture, created_time, permalink_url } = post;
      
      if (!message) continue; // Skip posts with no text content (e.g., pure links or image uploads without caption)

      const cleanMessage = message.trim();
      const firstLine = cleanMessage.split("\n")[0].trim();
      const title = firstLine.length > 70 
        ? firstLine.substring(0, 67) + "..." 
        : firstLine || "ফেসবুক আপডেট";

      const excerpt = cleanMessage.length > 180 
        ? cleanMessage.substring(0, 177) + "..." 
        : cleanMessage;

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
      
      let content = cleanMessage;
      if (permalink_url) {
        content += `\n\n---\n[মূল পোস্টটি ফেসবুকে দেখুন](${permalink_url})`;
      }

      const blogPost = {
        title,
        slug,
        excerpt,
        content,
        image: full_picture || "/assets/post-win-election.jpeg",
        date: postDate,
        author: "Yaser Khan Chowdhury",
        facebook_id: id,
        updatedAt: new Date(),
      };

      await collection.updateOne(
        { slug: slug },
        { 
          $set: blogPost,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );

      syncedCount++;
    }

    // Redirect to the blog archive page after successful sync
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://yaserkhanchowdhury.com";
    return NextResponse.redirect(`${origin}/blog?synced=${syncedCount}`);

  } catch (err) {
    console.error("Facebook feed sync error:", err);
    return NextResponse.json(
      { error: "Internal server error performing sync operation" },
      { status: 500 }
    );
  }
}
