import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

// Server side data fetch
async function getRecentPosts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = await db
      .collection("posts")
      .find({})
      .limit(3)
      .toArray();
    
    // Map ObjectId to string for page props
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
    console.error("Failed to fetch recent posts from DB, using fallback", err);
    // Return fallback static posts if DB is down/not seeded yet
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
      }
    ];
  }
}

export default async function Home() {
  const posts = await getRecentPosts();

  // Define gallery items (32)
  const galleryItems = Array.from({ length: 32 }, (_, i) => i + 1);

  return (
    <>
      {/* Hero Section */}
      <section className="political-hero" aria-label="Introduction Banner">
        <div className="container hero-wrapper">
          <div className="hero-text-area">
            <div className="party-badge">বাংলাদেশ জাতীয়তাবাদী দল - বিএনপি</div>
            <h1 className="leader-name">ইয়াসের খান <span className="txt-green">চৌধুরী</span></h1>
            <h2 className="designation">মাননীয় প্রতিমন্ত্রী</h2>
            <h3 className="ministry">তথ্য ও সম্প্রচার মন্ত্রণালয়</h3>
            
            <div className="constituency-tag">
              <span className="icon" aria-hidden="true"><i className="fas fa-map-marker-alt"></i></span> নান্দাইল উপজেলা (১৫৪ নং আসন)
            </div>

            <p className="hero-mission">
              শহীদ জিয়ার আদর্শে অনুপ্রাণিত হয়ে, আমরা নান্দাইলের মাটি ও মানুষের অধিকার রক্ষায় এবং একটি আধুনিক, তথ্যসমৃদ্ধ ও গণতান্ত্রিক বাংলাদেশ গড়ার লক্ষ্যে অঙ্গীকারবদ্ধ।
            </p>

            <div className="action-buttons">
              <Link href="/vision-2030" className="p-btn p-btn-primary" aria-label="স্মার্ট নান্দাইল ভিশন পৃষ্ঠা দেখুন">স্মার্ট নান্দাইল ভিশন</Link>
              <Link href="#contact" className="p-btn p-btn-outline" aria-label="যোগাযোগ ফরমে যান">Contact me</Link>
            </div>
          </div>

          <div className="hero-graphic">
            <div className="frame-decoration"></div>
            <Image 
              src="/assets/profile-hero.png" 
              alt="Yaser Khan Chowdhury Portrait" 
              className="profile-img" 
              width={420} 
              height={500} 
              priority 
              style={{ objectFit: "cover", height: "auto" }} 
            />
          </div>
        </div>
      </section>

      {/* Ministerial Metrics Section */}
      <section className="metrics-section" aria-label="Constituency and Portfolio Metrics">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-num" aria-label="Eighty Five Thousand Seven Hundred Sixty One Plus">৮৫,৭৬১+</div>
              <div className="metric-label">ভোটারদের রায়</div>
              <div className="metric-desc">গণতান্ত্রিক নির্বাচনে নান্দাইলের ঐতিহাসিক ম্যান্ডেট</div>
            </div>
            <div className="metric-card">
              <div className="metric-num" aria-label="Constituency Mymensingh Nine">১৫৪ নং আসন</div>
              <div className="metric-label">ময়মনসিংহ-৯ (নান্দাইল)</div>
              <div className="metric-desc">নির্বাচনী এলাকার উন্নয়ন ও জনকল্যাণে অঙ্গীকারবদ্ধ</div>
            </div>
            <div className="metric-card">
              <div className="metric-num" aria-label="Thirty One State Reforms">৩১ দফা</div>
              <div className="metric-label">রাষ্ট্র সংস্কারের ভিশন</div>
              <div className="metric-desc">দেশনায়ক তারেক রহমান ঘোষিত মৌলিক কাঠামোর রূপরেখা</div>
            </div>
            <div className="metric-card">
              <div className="metric-num" aria-label="One Hundred Percent Transparency">১০০%</div>
              <div className="metric-label">স্বচ্ছতা ও জবাবদিহিতা</div>
              <div className="metric-desc">অবাধ তথ্য প্রবাহ ও গুজবমুক্ত সমাজ বিনির্মাণ</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" aria-labelledby="about-heading">
        <div className="container about-container">
          <div className="about-image-side">
            <div className="experience-badge">
              <span className="exp-year">১৫৪</span>
              <span className="exp-text">নান্দাইল আসন</span>
            </div>
            <Image 
              src="/assets/about-profile.jpeg" 
              alt="Yaser Khan Chowdhury working in Mymensingh" 
              width={450} 
              height={550} 
              style={{ objectFit: "cover", width: "100%", height: "auto", borderRadius: "15px" }} 
            />
          </div>

          <div className="about-text-side">
            <h4 className="sub-heading">আমার সম্পর্কে</h4>
            <h2 id="about-heading" className="main-heading">জনগণের সেবায়, ন্যায়ের <span className="highlight">পথে অবিচল</span></h2>
            
            <p className="about-para">
              আমি <strong>ইয়াসের খান চৌধুরী</strong>, শহীদ রাষ্ট্রপতির জিয়ার আদর্শে অনুপ্রাণিত একজন নিবেদিতপ্রাণ রাজনৈতিক কর্মী। বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)-এর একজন সদস্য হিসেবে এবং বর্তমানে গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের <strong>তথ্য ও সম্প্রচার মন্ত্রণালয়ের মাননীয় প্রতিমন্ত্রী</strong> হিসেবে দায়িত্ব পালন করছি।
            </p>
            
            <p className="about-para">
              নান্দাইল উপজেলা (১৫৪ নং আসন)-এর মাটি ও মানুষের সাথে আমার নাড়ির সম্পর্ক। আমার মূল লক্ষ্য হলো তথ্যের অবাধ প্রবাহ নিশ্চিত করা এবং একটি আধুনিক, বৈষম্যহীন ও গণতান্ত্রিক সমাজ বিনির্মাণ করা।
            </p>

            <ul className="mission-list">
              <li><span className="check-icon" aria-hidden="true"><i className="fas fa-check"></i></span> স্বচ্ছ ও জবাবদিহিতামূলক প্রশাসন নিশ্চিত করা।</li>
              <li><span className="check-icon" aria-hidden="true"><i className="fas fa-check"></i></span> তরুণ প্রজন্মের জন্য কর্মসংস্থান ও আইটি খাতের উন্নয়ন।</li>
              <li><span className="check-icon" aria-hidden="true"><i className="fas fa-check"></i></span> তৃণমূল মানুষের অধিকার আদায়ে সোচ্চার থাকা।</li>
            </ul>

            <div className="signature-area">
              <div className="sig-text">
                <strong>ইয়াসের খান চৌধুরী</strong><br />
                <span>মাননীয় প্রতিমন্ত্রী</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministerial Message Card Section */}
      <section className="minister-welcome-section" aria-labelledby="welcome-card-title">
        <div className="container">
          <div className="minister-welcome-card">
            <div className="minister-badge-graphic">
              <Image 
                src="/assets/about-profile.jpeg" 
                alt="Minister Badge Portrait" 
                width={120} 
                height={120} 
                style={{ objectFit: "cover", width: "100px", height: "100px", borderRadius: "50%" }} 
              />
            </div>
            <div className="minister-welcome-text">
              <h4 className="sub-heading">মাননীয় প্রতিমন্ত্রীর বার্তা</h4>
              <h2 id="welcome-card-title">তথ্যই শক্তি: অবাধ তথ্য প্রবাহ নিশ্চিত করাই আমাদের অঙ্গীকার</h2>
              <p>
                তথ্য ও সম্প্রচার মন্ত্রণালয়ের প্রতিমন্ত্রী হিসেবে আমার প্রধান কাজ হলো জনগণের তথ্য অধিকার রক্ষা করা এবং সরকারি কর্মকাণ্ডে স্বচ্ছতা ও জবাবদিহিতা নিশ্চিত করা। শহীদ জিয়ার আদর্শ এবং দেশনায়ক তারেক রহমানের ৩১ দফার আলোকেই আমরা একটি আধুনিক, শোষণমুক্ত এবং আইটি-সমৃদ্ধ নতুন বাংলাদেশ গড়ে তুলবো। জনগণের দোড়গোড়ায় নিরবচ্ছিন্ন সেবা ও গুজবমুক্ত সংবাদ পৌঁছে দিতে আমাদের মন্ত্রণালয় দিনরাত কাজ করছে.
              </p>
              <a 
                href="https://moi.gov.bd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="minister-portal-btn"
                aria-label="তথ্য ও সম্প্রচার মন্ত্রণালয়ের অফিশিয়াল ওয়েবসাইট ভিজিট করুন (নতুন ট্যাবে খুলবে)"
              >
                <i className="fas fa-external-link-alt" aria-hidden="true"></i> তথ্য ও সম্প্রচার মন্ত্রণালয় পোর্টাল
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Action Plan Section */}
      <section className="action-plan-section" aria-labelledby="action-title">
        <div className="container">
          <div className="section-title">
            <h2 id="action-title" className="title-text">নান্দাইল গড়বো <span className="highlight-green">নতুন উদ্যমে</span></h2>
            <p className="subtitle-text">জনগণের অধিকার ও সামাজিক নিরাপত্তা নিশ্চিত করাই আমাদের মূল লক্ষ্য।</p>
          </div>

          <div className="action-grid">
            <div className="action-card warning-border">
              <div className="action-icon" aria-hidden="true">🚫</div>
              <h3>জিরো টলারেন্স</h3>
              <p>মাদকের বিরুদ্ধে জিরো টলারেন্স এবং সব ধরনের চাঁদাবাজি ও জুলুম বন্ধে আমরা কঠোর অবস্থানে। নান্দাইল হবে নিরাপদ ও শান্তিময়।</p>
            </div>

            <div className="action-card green-border">
              <div className="action-icon" aria-hidden="true">🏥</div>
              <h3>শিক্ষা ও স্বাস্থ্য</h3>
              <p>আধুনিক মানসম্মত শিক্ষা এবং দোরগোড়ায় স্বাস্থ্যসেবা পৌঁছে দেওয়া। প্রতিটি মানুষের জন্য বিনামূল্যে ঔষধ ও সুচিকিৎসা নিশ্চিত করা।</p>
            </div>

            <div className="action-card green-border">
              <div className="action-icon" aria-hidden="true">🌾</div>
              <h3>কৃষি বিপ্লব</h3>
              <p>আধুনিক প্রযুক্তির সমন্বয়ে কৃষি বিপ্লব ঘটানো। কৃষকদের ন্যায্য মূল্য এবং প্রয়োজনীয় সার ও বীজ সহজলভ্য করা হবে।</p>
            </div>

            <div className="action-card blue-border">
              <div className="action-icon" aria-hidden="true">💼</div>
              <h3>বেকারত্ব মুক্তি</h3>
              <p>কারিগরি শিক্ষা ও আইটি সেক্টরে প্রশিক্ষণের মাধ্যমে বেকার সমস্যার স্থায়ী সমাধান এবং যুবকদের জন্য কর্মসংস্থান সৃষ্টি করা।</p>
            </div>
          </div>

          <div className="political-slogan-box">
            <h3 className="slogan-white">&quot;মাদক ও চাঁদাবাজমুক্ত নান্দাইল গড়াই <span className="slogan-yellow">আমাদের অঙ্গীকার&quot;</span></h3>
          </div>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section className="updates-section" aria-labelledby="updates-title">
        <div className="container">
          <div className="section-title">
            <h2 id="updates-title" className="title-text">Recent <span className="highlight-green">Updates</span></h2>
            <p className="subtitle-text">সর্বশেষ সংবাদ ও আমাদের চলমান কার্যক্রম</p>
          </div>

          <div className="blog-grid">
            {posts.map((post) => (
              <div className="blog-card" key={post.id}>
                <Link href={`/blog/${post.slug}`} className="blog-thumb-link" aria-label={`${post.title} পোস্ট পড়ুন`}>
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
                  <Link href={`/blog/${post.slug}`} className="read-more-link" aria-label={`${post.title} পোস্ট পড়ুন`}>Read More</Link>
                </div>
              </div>
            ))}
          </div>

          <div className="center-btn">
            <Link href="/blog" className="p-btn p-btn-primary" aria-label="সকল সংবাদ ও আপডেট দেখুন">View More Updates</Link>
          </div>
        </div>
      </section>

      {/* Journey Gallery Section */}
      <section className="journey-gallery-section" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-title">
            <h2 id="gallery-title" className="title-text">আমার <span className="highlight-green">পথচলা</span></h2>
            <p className="subtitle-text">নান্দাইলের মানুষের সাথে কাটানো কিছু স্মৃতিময় মুহূর্ত</p>
          </div>

          <div className="journey-grid">
            {galleryItems.map((num) => (
              <div className="gallery-item" key={num} tabIndex={0} aria-label={`পথচলা গ্যালারি ছবি ${num}`}>
                <Image 
                  src={`/assets/gallery-${num}.jpg`} 
                  alt={`Journey Moment ${num}`} 
                  width={300} 
                  height={400} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Directory Section */}
      <section className="portals-section" aria-labelledby="portals-title">
        <div className="container">
          <div className="section-title">
            <h2 id="portals-title" className="title-text">গুরুত্বপূর্ণ <span className="highlight-green">সরকারি লিঙ্কসমূহ</span></h2>
            <p className="subtitle-text">তথ্য ও সেবার জন্য সরকারি পোর্টালসমূহের তালিকা</p>
          </div>

          <div className="portals-list-grid">
            <div className="portal-dir-card">
              <div className="portal-icon" aria-hidden="true"><i className="fas fa-building"></i></div>
              <div className="portal-details">
                <h4>তথ্য ও সম্প্রচার মন্ত্রণালয়</h4>
                <a href="https://moi.gov.bd" target="_blank" rel="noopener noreferrer" aria-label="তথ্য ও সম্প্রচার মন্ত্রণালয় পোর্টাল ভিজিট করুন (নতুন ট্যাবে খুলবে)">moi.gov.bd</a>
              </div>
            </div>

            <div className="portal-dir-card">
              <div className="portal-icon" aria-hidden="true"><i className="fas fa-globe"></i></div>
              <div className="portal-details">
                <h4>বাংলাদেশ জাতীয় তথ্য বাতায়ন</h4>
                <a href="https://bangladesh.gov.bd" target="_blank" rel="noopener noreferrer" aria-label="বাংলাদেশ জাতীয় তথ্য বাতায়ন ভিজিট করুন (নতুন ট্যাবে খুলবে)">bangladesh.gov.bd</a>
              </div>
            </div>

            <div className="portal-dir-card">
              <div className="portal-icon" aria-hidden="true"><i className="fas fa-university"></i></div>
              <div className="portal-details">
                <h4>বাংলাদেশ সচিবালয়</h4>
                <a href="https://mopa.gov.bd" target="_blank" rel="noopener noreferrer" aria-label="বাংলাদেশ সচিবালয় পোর্টাল ভিজিট করুন (নতুন ট্যাবে খুলবে)">mopa.gov.bd</a>
              </div>
            </div>

            <div className="portal-dir-card">
              <div className="portal-icon" aria-hidden="true"><i className="fas fa-check-to-slot"></i></div>
              <div className="portal-details">
                <h4>বাংলাদেশ নির্বাচন কমিশন</h4>
                <a href="https://ecs.gov.bd" target="_blank" rel="noopener noreferrer" aria-label="বাংলাদেশ নির্বাচন কমিশন পোর্টাল ভিজিট করুন (নতুন ট্যাবে খুলবে)">ecs.gov.bd</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Feedback Section */}
      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="container contact-wrapper">
          <div className="contact-info-panel">
            <h4 className="sub-heading">যোগাযোগ</h4>
            <h3 id="contact-title">সরাসরি যোগাযোগ করুন</h3>
            <div className="contact-card-info">
              <div className="contact-item">
                <div className="contact-icon-box" aria-hidden="true"><i className="fas fa-map-marked-alt"></i></div>
                <div className="contact-details">
                  <h4>Address</h4>
                  <p>
                    মাননীয় প্রতিমন্ত্রীর কার্যালয়{"\n"}
                    তথ্য ও সম্প্রচার মন্ত্রণালয়{"\n"}
                    বাংলাদেশ সচিবালয়, ঢাকা।{"\n\n"}
                    নির্বাচনী এলাকার কার্যালয়:{"\n"}
                    নান্দাইল উপজেলা বিএনপি কার্যালয়,{"\n"}
                    নান্দাইল, ময়মনসিংহ-১৫৪ নং আসন।
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box" aria-hidden="true"><i className="fas fa-envelope"></i></div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>contact@yaserkhanchowdhury.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box" aria-hidden="true"><i className="fab fa-whatsapp"></i></div>
                <div className="contact-details">
                  <h4>WhatsApp / Phone</h4>
                  <p>
                    <a href="https://wa.me/8801771242424" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp মেসেজ পাঠান">+880 1771-242424</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="social-links-panel">
              <h4>Socials</h4>
              <div className="social-row">
                <a href="https://www.facebook.com/Nandailykc" className="social-icon-btn" aria-label="Facebook Profile" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
                <a href="#" className="social-icon-btn" aria-label="Twitter Profile"><i className="fab fa-twitter" aria-hidden="true"></i></a>
                <a href="#" className="social-icon-btn" aria-label="Instagram Profile"><i className="fab fa-instagram" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
