import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getAllPosts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = await db
      .collection("posts")
      .find({})
      .toArray();

    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: post.image,
      date: post.date,
      author: post.author || "Admin"
    }));
  } catch (err) {
    console.error("Failed to fetch posts from DB, using fallback", err);
    // Fallbacks
    return [
      {
        id: "1",
        title: "তথ্য ও সম্প্রচার মন্ত্রণালয়ের দায়িত্ব গ্রহণ: এক নতুন লড়াইয়ের শপথ",
        slug: "yaserkhan-chowdhury-deputy-minister",
        excerpt: "বিসমিল্লাহির রাহমানির রাহিম আমার প্রাণের নান্দাইলবাসী এবং দেশবাসী, আসসালামু আলাইকুম। আলহামদুলিল্লাহ। মহান রাব্বুল আলামিনের দরবারে অশেষ শুকরিয়া যে, তিনি আমাকে...",
        image: "/assets/post-deputy-minister.webp",
        date: "February 17, 2026",
        author: "Admin"
      },
      {
        id: "2",
        title: "শুকরিয়া নান্দাইল! ধানের শীষের বিজয়ে নতুন ভোরের পথে বাংলাদেশ।",
        slug: "win-election",
        excerpt: "শুকরিয়া নান্দাইল! ধানের শীষের বিজয়ে নতুন ভোরের পথে বাংলাদেশ। 🗳️🌾 বিসমিল্লাহির রাহমানির রাহিম, আলহামদুলিল্লাহ! ময়মনসিংহে-৯ (নান্দাইল) আসনের আমার প্রিয় সর্বস্তরের...",
        image: "/assets/post-win-election.jpeg",
        date: "February 17, 2026",
        author: "Admin"
      },
      {
        id: "3",
        title: "গণতন্ত্রের বাতিঘর: শোকাতুর হৃদয়ে আমাদের অবিচল যাত্রা",
        slug: "begum-zia",
        excerpt: "গণতন্ত্রের বাতিঘর: শোকাতুর হৃদয়ে আমাদের অবিচল যাত্রা বিসমিল্লাহির রাহমানির রাহিম আমার প্রিয় নান্দাইলবাসী, আসসালামু আলাইকুম। আজ আমাদের সবার হৃদয় ভারাক্রান্ত।...",
        image: "/assets/post-begum-zia.jpeg",
        date: "February 17, 2026",
        author: "Admin"
      },
      {
        id: "4",
        title: "গণতন্ত্রের জয়, নান্দাইলবাসীর বিজয়: আমাদের নতুন ভোরের শুরু",
        slug: "150-2",
        excerpt: "গণতন্ত্রের জয়, নান্দাইলবাসীর বিজয়: আমাদের নতুন ভোরের শুরু বিসমিল্লাহির রাহমানির রাহিম আমার প্রিয় নান্দাইলবাসী, আসসালামু আলাইকুম। ১২ ফেব্রুয়ারি ২০২৬—বাংলাদেশের গণতান্ত্রিক নির্বাচনে...",
        image: "/assets/post-150-2.jpeg",
        date: "February 17, 2026",
        author: "Admin"
      },
      {
        id: "5",
        title: "নান্দাইলের মানুষের ভালোবাসায় নতুন পথচলা: একটি কৃতজ্ঞতা বার্তা",
        slug: "mononoyon",
        excerpt: "নান্দাইলের মানুষের ভালোবাসায় নতুন পথচলা: একটি কৃতজ্ঞতা বার্তা বিসমিল্লাহির রাহমানির রাহিম আমার প্রিয় নান্দাইলবাসী, আসসালামু আলাইকুম। নান্দাইলের ধুলোবালিতে আমার বেড়ে ওঠা...",
        image: "/assets/post-mononoyon.jpeg",
        date: "February 17, 2026",
        author: "Admin"
      }
    ];
  }
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ synced?: string }>;
}) {
  const { synced } = await searchParams;
  const posts = await getAllPosts();

  return (
    <>
      {/* Page Banner */}
      <section className="page-hero-banner" role="region" aria-label="Page Banner">
        <div className="container">
          <h1 className="page-title">Blog Updates</h1>
          <p className="page-subtitle">আমাদের কার্যক্রম, প্রেস রিলিজ এবং নান্দাইলবাসীর উদ্দেশ্যে বিশেষ বার্তা সমূহ</p>
        </div>
      </section>

      {/* Sync Success Notification */}
      {synced !== undefined && (
        <div className="container" style={{ marginTop: "30px", marginBottom: "-10px" }}>
          <div className="sync-success-banner" style={{
            padding: "15px 20px",
            backgroundColor: "rgba(0, 104, 55, 0.1)",
            border: "1px solid rgba(0, 104, 55, 0.3)",
            borderRadius: "8px",
            color: "#006837",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "15px",
            fontWeight: "500"
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: "18px" }}></i>
            <span>ফেসবুক পেজ থেকে সফলভাবে {synced}টি আপডেট সিঙ্ক করা হয়েছে।</span>
          </div>
        </div>
      )}

      {/* Blog Archive Section */}
      <section className="updates-section" aria-labelledby="archive-title">
        <div className="container">
          <h2 id="archive-title" className="sr-only" style={{ display: "none" }}>আর্কাইভ পোস্ট তালিকা</h2>
          <div className="blog-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {posts.map((post) => (
              <div className="blog-card" key={post.id}>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="blog-thumb-link"
                  aria-label={`${post.title} পোস্ট পড়ুন`}
                >
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    className="blog-thumb" 
                    width={400} 
                    height={250} 
                    style={{ objectFit: "cover" }} 
                  />
                </Link>
                <div className="blog-body">
                  <div className="blog-meta">{post.date} | By {post.author}</div>
                  <h3 className="blog-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="read-more-link"
                    aria-label={`${post.title} পোস্ট পড়ুন`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
