import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// Helper helper helper function to parse RSS XML using simple regex
function parseRssXml(xmlText: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    // Helper helper to extract tag content
    const extractTag = (tag: string) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i");
      const m = regex.exec(itemContent);
      return m && m[1] ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/i, "$1").trim() : "";
    };

    const title = extractTag("title");
    const link = extractTag("link");
    const description = extractTag("description");
    const pubDate = extractTag("pubDate");

    // Extract image URL from enclosure tag
    const enclosureRegex = /<enclosure[^>]+url="([^"]+)"/i;
    const enclosureMatch = enclosureRegex.exec(itemContent);
    let imageUrl = enclosureMatch ? enclosureMatch[1] : "";

    // If no enclosure, try media:content
    if (!imageUrl) {
      const mediaRegex = /<media:content[^>]+url="([^"]+)"/i;
      const mediaMatch = mediaRegex.exec(itemContent);
      if (mediaMatch) {
        imageUrl = mediaMatch[1];
      }
    }

    // If still no image, try to find img src in description
    if (!imageUrl && description) {
      const imgRegex = /<img[^>]+src="([^"]+)"/i;
      const imgMatch = imgRegex.exec(description);
      imageUrl = imgMatch ? imgMatch[1] : "";
    }

    // Decode HTML entities in image URL (often required for FB CDN links in XML)
    if (imageUrl) {
      imageUrl = imageUrl.replace(/&amp;/g, "&");
    }

    // Strip HTML tags from description for excerpt/content if needed
    const cleanDescription = description
      .replace(/<[^>]*>/g, "") // Strip HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    // Generate unique ID from link or title
    const guidRegex = /<guid[^>]*>([\s\S]*?)<\/guid>/i;
    const guidMatch = guidRegex.exec(itemContent);
    const id = guidMatch ? guidMatch[1].trim() : link || title;

    items.push({
      id,
      title: title || cleanDescription.substring(0, 60),
      link,
      description: cleanDescription,
      imageUrl,
      pubDate,
    });
  }

  return items;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const isCron = searchParams.get("isCron") === "true";

    // Verify secret for API security against DDoS and DB abuse
    const webhookSecret = process.env.FB_WEBHOOK_SECRET || "ykc_fb_webhook_secure_key_2026";
    if (secret !== webhookSecret) {
      return NextResponse.json(
        { error: "Unauthorized access: Invalid secret key" },
        { status: 401 }
      );
    }

    const rssUrl = process.env.FACEBOOK_RSS_URL;

    if (!rssUrl) {
      return NextResponse.json(
        { 
          error: "Facebook RSS URL is missing.",
          instruction: "Please convert your public Facebook Page link to RSS using a free tool like FetchRSS (fetchrss.com) or RSS.app, and set the resulting feed link as 'FACEBOOK_RSS_URL' in your Vercel Environment Variables."
        },
        { status: 400 }
      );
    }

    console.log(`Syncing from Facebook RSS Feed: ${rssUrl}...`);
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed. Status: ${response.status}` },
        { status: 500 }
      );
    }

    const xmlText = await response.text();
    const feedItems = parseRssXml(xmlText);

    if (feedItems.length === 0) {
      return NextResponse.json({ success: true, message: "No posts found in the RSS feed to sync" });
    }

    // Connect to DB and upsert posts
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("posts");

    let syncedCount = 0;

    for (const item of feedItems) {
      const { id, title, link, description, imageUrl, pubDate } = item;

      if (!description) continue;

      const excerpt = description.length > 180 
        ? description.substring(0, 177) + "..." 
        : description;

      // Hash or format slug from guid/link
      const uniqueId = id.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 50);
      const slug = `fb-${uniqueId}`;

      const postDate = pubDate 
        ? new Date(pubDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

      let content = description;
      if (link) {
        content += `\n\n---\n[মূল পোস্টটি ফেসবুকে দেখুন](${link})`;
      }

      const blogPost = {
        title: title || "ফেসবুক আপডেট",
        slug,
        excerpt,
        content,
        image: imageUrl || "/assets/post-win-election.jpeg",
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

    // Trigger on-demand cache revalidation for pre-rendered pages
    try {
      revalidatePath("/blog");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    // Return JSON if triggered by cron, otherwise redirect
    if (isCron) {
      return NextResponse.json({ success: true, message: `Successfully synced ${syncedCount} posts` });
    }

    // Redirect to the blog archive page after successful manual sync
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://yaserkhanchowdhury.com";
    return NextResponse.redirect(`${origin}/blog?synced=${syncedCount}`);

  } catch (err) {
    console.error("Facebook RSS feed sync error:", err);
    return NextResponse.json(
      { error: "Internal server error performing sync operation" },
      { status: 500 }
    );
  }
}
