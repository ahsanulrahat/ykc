const url = 'https://rss.app/feeds/hdeq4htjytDn7cyP.xml';

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

async function debugRss() {
    try {
        console.log(`Fetching RSS feed from ${url}...`);
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        console.log(`Response status: ${res.status}`);
        const text = await res.text();
        console.log(`XML length: ${text.length}`);
        
        const parsed = parseRssXml(text);
        console.log(`Parsed ${parsed.length} items.`);
        if (parsed.length > 0) {
            console.log("First item:", JSON.stringify(parsed[0], null, 2));
        } else {
            console.log("XML content snippet:", text.substring(0, 1000));
        }
    } catch (e) {
        console.error("Error during debug:", e);
    }
}

debugRss();
