import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Dynamic content renderer to render markdown text properly
function renderContent(content: string) {
  return content.split("\n\n").map((paragraph, index) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("###")) {
      const text = trimmed.replace(/###\s*\*\*?|\*\*?/g, "").trim();
      return <h3 key={index}><strong>{text}</strong></h3>;
    }
    if (trimmed.startsWith("##")) {
      const text = trimmed.replace(/##\s*\*\*?|\*\*?/g, "").trim();
      return <h2 key={index}><strong>{text}</strong></h2>;
    }
    if (trimmed.startsWith("*")) {
      const items = trimmed.split("\n").map(item => item.replace(/^\*\s*/, "").trim());
      return (
        <ul key={index}>
          {items.map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      );
    }

    const formattedText = trimmed.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return <p key={index}>{formattedText}</p>;
  });
}

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  let prevPost: { title: string; slug: string } | null = null;
  let nextPost: { title: string; slug: string } | null = null;

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("posts");

    const foundPost = await collection.findOne({ slug });
    if (!foundPost) {
      return notFound();
    }

    post = {
      title: foundPost.title,
      slug: foundPost.slug,
      excerpt: foundPost.excerpt,
      content: foundPost.content,
      image: foundPost.image,
      date: foundPost.date,
      author: foundPost.author || "Admin",
    };

    const allPosts = await collection.find({}).toArray();
    const currentIndex = allPosts.findIndex(p => p.slug === slug);

    if (currentIndex > 0) {
      prevPost = {
        title: allPosts[currentIndex - 1].title,
        slug: allPosts[currentIndex - 1].slug,
      };
    }
    if (currentIndex < allPosts.length - 1) {
      nextPost = {
        title: allPosts[currentIndex + 1].title,
        slug: allPosts[currentIndex + 1].slug,
      };
    }
  } catch (err) {
    console.error("Failed to load post from DB, using fallback", err);
    return notFound();
  }

  return (
    <>
      {/* Page Banner */}
      <section className="page-hero-banner" role="region" aria-label="Page Banner">
        <div className="container">
          <h1 className="page-title">Blog Detail</h1>
          <p className="page-subtitle">ইয়াসের খান চৌধুরীর অফিসিয়াল ব্লগ পোস্ট</p>
        </div>
      </section>

      {/* Blog Details Section */}
      <section className="blog-detail-section" aria-label="Blog Article Section">
        <div className="container blog-detail-container">
          <article aria-labelledby="post-title">
            <header className="blog-detail-header">
              <h1 id="post-title" className="blog-detail-title">{post.title}</h1>
              <div className="blog-detail-meta">
                By <span>{post.author}</span> <span className="divider" aria-hidden="true">|</span> {post.date}
              </div>
            </header>

            <div className="blog-detail-content">
              <Image 
                src={post.image} 
                alt={post.title} 
                width={800} 
                height={450} 
                priority 
                style={{ objectFit: "cover", width: "100%", height: "auto", borderRadius: "12px", marginBottom: "30px" }} 
              />
              {renderContent(post.content)}
            </div>
          </article>

          {/* Chronological Post Navigation */}
          <nav className="post-navigation" aria-label="Post Navigation">
            <div className="nav-box">
              {prevPost && (
                <>
                  <span className="nav-label" aria-hidden="true">Previous Post</span>
                  <Link 
                    href={`/blog/${prevPost.slug}`} 
                    className="nav-post-title"
                    aria-label={`পূর্ববর্তী পোস্ট: ${prevPost.title}`}
                  >
                    {prevPost.title}
                  </Link>
                </>
              )}
            </div>
            <div className="nav-box" style={{ textAlign: "right" }}>
              {nextPost && (
                <>
                  <span className="nav-label" aria-hidden="true">Next Post</span>
                  <Link 
                    href={`/blog/${nextPost.slug}`} 
                    className="nav-post-title"
                    aria-label={`পরবর্তী পোস্ট: ${nextPost.title}`}
                  >
                    {nextPost.title}
                  </Link>
                </>
              )}
            </div>
          </nav>

          <Link href="/blog" className="back-to-blog" aria-label="ব্লগ আর্কাইভে ফিরে যান">
            ← Back to Blog
          </Link>
        </div>
      </section>
    </>
  );
}
