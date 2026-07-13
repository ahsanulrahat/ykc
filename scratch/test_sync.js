const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let mongodbUri = 'mongodb://127.0.0.1:27017/ykc_portfolio';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI\s*=\s*(.*)$/m);
    if (match && match[1]) {
        mongodbUri = match[1].trim();
    }
}

const rssUrl = 'https://rss.app/feeds/hdeq4htjytDn7cyP.xml';

function parseRssXml(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    const extractTag = (tag) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i");
      const m = regex.exec(itemContent);
      return m && m[1] ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/i, "$1").trim() : "";
    };

    const title = extractTag("title");
    const link = extractTag("link");
    const description = extractTag("description");
    const pubDate = extractTag("pubDate");

    const enclosureRegex = /<enclosure[^>]+url="([^"]+)"/i;
    const enclosureMatch = enclosureRegex.exec(itemContent);
    let imageUrl = enclosureMatch ? enclosureMatch[1] : "";

    if (!imageUrl && description) {
      const imgRegex = /<img[^>]+src="([^"]+)"/i;
      const imgMatch = imgRegex.exec(description);
      imageUrl = imgMatch ? imgMatch[1] : "";
    }

    const cleanDescription = description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

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

async function testSync() {
    try {
        console.log(`Connecting to MongoDB at: ${mongodbUri}`);
        const client = new MongoClient(mongodbUri);
        await client.connect();
        const db = client.db();
        const collection = db.collection('posts');

        console.log(`Fetching RSS feed from ${rssUrl}...`);
        const res = await fetch(rssUrl);
        const xmlText = await res.text();
        const feedItems = parseRssXml(xmlText);
        
        console.log(`Parsed ${feedItems.length} items. Syncing with database...`);
        let syncedCount = 0;

        for (const item of feedItems) {
            const { id, title, link, description, imageUrl, pubDate } = item;
            if (!description) continue;

            const excerpt = description.length > 180 
                ? description.substring(0, 177) + "..." 
                : description;

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

        console.log(`Successfully synced ${syncedCount} posts locally!`);
        
        // Let's print out what is in the DB now to verify
        const dbPosts = await collection.find({ slug: { $regex: /^fb-/ } }).toArray();
        console.log(`Current DB contains ${dbPosts.length} synced Facebook posts.`);
        
        await client.close();
    } catch (e) {
        console.error("Local sync test failed:", e);
    }
}

testSync();
