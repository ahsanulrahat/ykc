"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/animations/MotionWrapper";

interface AccordionItem {
  id: number;
  title: string;
  content: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  "গণতন্ত্র ও রাষ্ট্র সংস্কার": "#006837",
  "আইন ও বিচার": "#1976d2",
  "অর্থনীতি ও সুশাসন": "#d4af37",
  "সমাজ ও মানবাধিকার": "#9c27b0",
  "উন্নয়ন ও প্রযুক্তি": "#f57c00",
};

export default function Vision2030() {
  const [activeId, setActiveId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState<string>("সব");

  const toggleAccordion = (id: number) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const accordionData: AccordionItem[] = [
    { id: 1, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "১. সংবিধানে 'গণভোট' ব্যবস্থা পুনঃপ্রবর্তন", content: "জনগণের গণতান্ত্রিক অধিকার পুনরুদ্ধারের লক্ষ্যে সংবিধানে 'গণভোট' ব্যবস্থা পুনঃপ্রবর্তন করে জনগণের ম্যান্ডেট গ্রহণের বিধান পুনঃপ্রতিষ্ঠা করা হবে।" },
    { id: 2, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "২. জাতীয় সমন্বয় কমিশন গঠন", content: "প্রতিহিংসা ও প্রতিশোধের রাজনীতির অবসানকল্পে একটি অন্তর্ভুক্তিমূলক, সম্প্রীতি ও সৌহার্দ্যপূর্ণ সামাজিক চুক্তি (Social Contract) প্রতিষ্ঠার জন্য 'জাতীয় সমন্বয় কমিশন' (National Reconciliation Commission) গঠন করা হবে।" },
    { id: 3, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৩. নির্বাচনকালীন দলনিরপেক্ষ তত্ত্বাবধায়ক সরকার", content: "অবাধ্য, সুষ্ঠু, নিরপেক্ষ ও গ্রহণযোগ্য নির্বাচন নিশ্চিত করতে নির্বাচনকালীন দল-নিরপেক্ষ তত্ত্বাবধায়ক সরকার ব্যবস্থা পুনঃপ্রবর্তন করা হবে।" },
    { id: 4, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৪. ক্ষমতার ভারসাম্য ও বিভাগীয় সমন্বয়", content: "রাষ্ট্রপতি, প্রধানমন্ত্রী ও মন্ত্রিসভার নির্বাহী ক্ষমতার ভারসাম্য আনা হবে এবং নির্বাহী বিভাগ, আইন বিভাগ ও বিচার বিভাগের ক্ষমতার সুনির্দিষ্ট বিন্যাস করা হবে।" },
    { id: 5, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৫. দুই মেয়াদের বেশি প্রধানমন্ত্রী নয়", content: "একই ব্যক্তি পরপর দুই মেয়াদের বেশি প্রধানমন্ত্রী হিসেবে দায়িত্ব পালন করতে পারবেন না—এমন বিধান কার্যকর করা হবে।" },
    { id: 6, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৬. দ্বিকক্ষ বিশিষ্ট সংসদ চালু", content: "জাতীয় সংসদের অভিজ্ঞ ও বিশেষজ্ঞ ব্যক্তিবর্গের সমন্বয়ে একটি উচ্চকক্ষ প্রবর্তন করে দ্বিকক্ষ বিশিষ্ট সংসদ ব্যবস্থা চালু করা হবে।" },
    { id: 7, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৭. সংবিধানের ৭০ অনুচ্ছেদ সংশোধন", content: "সংসদ সদস্যদের স্বাধীন মতামত প্রদানের সুযোগ বাড়াতে সংবিধানের ৭০ অনুচ্ছেদ সংশোধন করা হবে।" },
    { id: 8, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৮. নির্বাচন কমিশন পুনর্গঠন ও স্বাধীনতা নিশ্চিতকরণ", content: "নির্বাচন কমিশন পুনর্গঠন ও স্বাধীনভাবে কাজ করার নিশ্চয়তা প্রদান করা হবে যাতে দেশের প্রতিটি নাগরিক নির্বিঘ্নে ভোট দিতে পারেন।" },
    { id: 9, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "৯. রাষ্ট্রীয় ও সাংবিধানিক প্রতিষ্ঠান সংস্কার", content: "রাষ্ট্রীয় ও সাংবিধানিক প্রতিষ্ঠানগুলোতে স্বচ্ছতা, জবাবদিহিতা ও নিরপেক্ষতা নিশ্চিত করতে প্রয়োজনীয় আইনগত ও প্রশাসনিক সংস্কার করা হবে।" },
    { id: 10, category: "আইন ও বিচার", title: "১০. বিচার বিভাগের স্বাধীনতা ও বিচারপতি নিয়োগ আইন", content: "জুডিশিয়াল কমিশন গঠন, সুপ্রীম জুডিশিয়াল কাউন্সিল পুনঃপ্রবর্তন এবং বিচারপতি নিয়োগ আইন প্রণয়ন করে বিচার বিভাগের শতভাগ স্বাধীনতা নিশ্চিত করা হবে।" },
    { id: 11, category: "আইন ও বিচার", title: "১১. জনপ্রশাসন ও Police সংস্কার", content: "জনপ্রশাসন ও পুলিশ বিভাগ সংস্কারের জন্য স্বাধীন কমিশন গঠন করা হবে। মেধা, যোগ্যতা ও দক্ষতার ভিত্তিতে নিয়োগ ও পদোন্নতি নিশ্চিত করা হবে।" },
    { id: 12, category: "আইন ও বিচার", title: "১২. মুক্ত গণমাধ্যম ও কালাকানুন বাতিল", content: "গণমাধ্যমের স্বাধীনতা নিশ্চিত করতে মিডিয়া কমিশন গঠন ও সমস্ত কালাকানুন বাতিল করা হবে যাতে সত্য প্রকাশের পথ উন্মুক্ত থাকে।" },
    { id: 13, category: "আইন ও বিচার", title: "১৩. দুর্নীতি প্রতিরোধ ও ন্যায়পাল নিয়োগ", content: "দুর্নীতি দমন কমিশনকে রাজনৈতিক প্রভাবমুক্ত করে শক্তিশালী করা হবে, ন্যায়পাল নিয়োগ করা হবে এবং বিগত বছরের দুর্নীতির শ্বেতপত্র প্রকাশ করা হবে।" },
    { id: 14, category: "আইন ও বিচার", title: "১৪. মানবাধিকার ও আইনের শাসন প্রতিষ্ঠা", content: "সর্বস্তরে মানবাধিকার ও আইনের শাসন প্রতিষ্ঠা করা হবে এবং গুম, খুন ও বিচারবহির্ভূত হত্যাকাণ্ডের সম্পূর্ণ অবসান ঘটানো হবে।" },
    { id: 15, category: "অর্থনীতি ও সুশাসন", title: "১৫. অর্থনৈতিক সংস্কার কমিশন গঠন", content: "অর্থনৈতিক সংস্কার কমিশন গঠন করে দেশের সামগ্রিক অর্থনৈতিক শৃঙ্খলা ফিরিয়ে আনা হবে এবং অর্থ পাচার রোধে কঠোর ব্যবস্থা নেওয়া হবে।" },
    { id: 16, category: "সমাজ ও মানবাধিকার", title: "১৬. ধর্মীয় স্বাধীনতা ও সংখ্যালঘুদের নিরাপত্তা", content: "ধর্মীয় স্বাধীনতা ও সাম্প্রদায়িক সম্প্রীতি নিশ্চিত করা হবে। ধর্মীয় ও জাতিগত সংখ্যালঘুদের নিরাপত্তা ও অধিকার পুরোপুরি রক্ষা করা হবে।" },
    { id: 17, category: "সমাজ ও মানবাধিকার", title: "১৭. শ্রমিক অধিকার ও ন্যূনতম মজুরি নির্ধারণ", content: "শ্রমিকদের ন্যায্য মজুরি নিশ্চিত করা হবে এবং বর্তমান মুদ্রাস্ফীতির সাথে সামঞ্জস্য রেখে একটি গ্রহণযোগ্য ন্যূনতম মজুরি নির্ধারণ করা হবে।" },
    { id: 18, category: "অর্থনীতি ও সুশাসন", title: "১৮. বিদ্যুৎ, জ্বালানি ও খনিজ খাতের সংস্কার", content: "শিল্প, বিদ্যুৎ, জ্বালানি ও খনিজ খাতে সংস্কার ও সুশাসন প্রতিষ্ঠা করে রেন্টাল পাওয়ার প্ল্যান্টের নামে লুটপাট বন্ধ করা হবে।" },
    { id: 19, category: "অর্থনীতি ও সুশাসন", title: "১৯. জাতীয় স্বার্থভিত্তিক বৈদেশিক নীতি", content: "জাতীয় স্বার্থকে সর্বোচ্চ অগ্রাধিকার দিয়ে বৈদেশিক সম্পর্ক উন্নয়ন ও সমতাভিত্তিক দ্বিপাক্ষিক সম্পর্ক জোরদার করা হবে।" },
    { id: 20, category: "অর্থনীতি ও সুশাসন", title: "২০. দেশপ্রেমিক প্রতিরক্ষা বাহিনীর আধুনিকায়ন", content: "দেশপ্রেমিক প্রতিরক্ষা বাহিনীকে আধুনিক প্রযুক্তি, সুসজ্জিত প্রশিক্ষণ এবং সমস্ত রাজনৈতিক বিতর্কের ঊর্ধ্বে রাখা হবে।" },
    { id: 21, category: "গণতন্ত্র ও রাষ্ট্র সংস্কার", title: "২১. স্থানীয় সরকারের ক্ষমতায়ন", content: "স্থানীয় সরকারকে স্বশাসিত, স্বাধীন ও শক্তিশালী করা হবে এবং জেলা পরিষদ ও ইউনিয়ন পরিষদগুলোতে নির্বাচিত প্রতিনিধিদের ক্ষমতা বৃদ্ধি করা হবে।" },
    { id: 22, category: "সমাজ ও মানবাধিকার", title: "২২. মুক্তিযোদ্ধাদের মর্যাদা ও পুনর্বাসন", content: "শহীদ মুক্তিযোদ্ধাদের রাষ্ট্রীয় মর্যাদা প্রদান, তাদের পরিবারগুলোর পুনর্বাসন ও একটি স্বচ্ছ তালিকার মাধ্যমে প্রকৃত মুক্তিযোদ্ধাদের সম্মান নিশ্চিত করা হবে।" },
    { id: 23, category: "সমাজ ও মানবাধিকার", title: "২৩. যুব উন্নয়ন ও বেকার ভাতা প্রবর্তন", content: "যুগোপযোগী যুব নীতিমালা প্রণয়ন, নতুন কর্মসংস্থান সৃষ্টি এবং বেকার যুবকদের কর্মসংস্থান নিশ্চিত না হওয়া পর্যন্ত বেকার ভাতা প্রদান করা হবে।" },
    { id: 24, category: "সমাজ ও মানবাধিকার", title: "২৪. নারী অধিকার ও সামাজিক নিরাপত্তা", content: "নারীদের সামাজিক মর্যাদা, নিরাপত্তা ও কর্মক্ষেত্রে সমান অধিকার নিশ্চিত করা হবে এবং যৌতুক ও নারী নির্যাতন প্রতিরোধে কঠোর ব্যবস্থা নেওয়া হবে।" },
    { id: 25, category: "উন্নয়ন ও প্রযুক্তি", title: "২৫. আধুনিক শিক্ষা ব্যবস্থা ও ৫% বরাদ্দ", content: "জ্ঞানভিত্তিক ও আধুনিক শিক্ষা ব্যবস্থা প্রবর্তন করা হবে এবং জিডিপির ৫% শিক্ষা খাতে বরাদ্দ দেওয়া নিশ্চিত করা হবে।" },
    { id: 26, category: "উন্নয়ন ও প্রযুক্তি", title: "২৬. সবার জন্য স্বাস্থ্য নিশ্চিতকরণ", content: "'সবার জন্য স্বাস্থ্য' নীতি বাস্তবায়ন করা হবে এবং স্বাস্থ্য খাতে জাতীয় বাজেট বরাদ্দ দ্বিগুণ করা হবে।" },
    { id: 27, category: "উন্নয়ন ও প্রযুক্তি", title: "২৭. কৃষি বিপ্লব ও ন্যায্যমূল্য নিশ্চিতকরণ", content: "কৃষিপণ্যের ন্যায্যমূল্য নিশ্চিতকরণ, কৃষি উপকরণ সহজলভ্য করা এবং আধুনিক কৃষি গবেষণা উন্নত করে কৃষকদের সামাজিক নিরাপত্তা দেওয়া হবে।" },
    { id: 28, category: "উন্নয়ন ও প্রযুক্তি", title: "২৮. যোগাযোগ ব্যবস্থার আধুনিকায়ন", content: "সড়ক, রেল, আকাশ ও নৌপথের আধুনিকায়ন, নিরাপদ যাতায়াত এবং যানজট নিরসনে পরিকল্পিত গণপরিবহন ব্যবস্থা গড়ে তোলা হবে।" },
    { id: 29, category: "উন্নয়ন ও প্রযুক্তি", title: "২৯. জলবায়ু পরিবর্তন ও নদী শাসন", content: "জলবায়ু পরিবর্তন মোকাবিলা, নদী শাসন, বন্যা নিয়ন্ত্রণ ও পানিসম্পদের সুষ্ঠু বন্টন নিশ্চিত করতে কার্যকর পদক্ষেপ নেওয়া হবে।" },
    { id: 30, category: "উন্নয়ন ও প্রযুক্তি", title: "৩০. বিজ্ঞান, তথ্যপ্রযুক্তি ও মহাকাশ গবেষণা", content: "তথ্যপ্রযুক্তি, মহাকাশ গবেষণা ও আণবিক শক্তির উন্নয়ন ঘটিয়ে বিজ্ঞান ও প্রযুক্তির প্রসার করে দেশীয় সক্ষমতা বৃদ্ধি করা হবে।" },
    { id: 31, category: "উন্নয়ন ও প্রযুক্তি", title: "৩১. পরিকল্পিত নগরায়ন ও আবাসন", content: "পরিকল্পিত ও পরিবেশবান্ধব নগরায়ন নিশ্চিত করা হবে এবং বস্তিবাসী ও নিম্ন আয়ের মানুষের জন্য সরকারি উদ্যোগে সুলভ আবাসনের ব্যবস্থা করা হবে।" },
  ];

  const categories = ["সব", ...Object.keys(categoryColors)];
  const filteredData = activeCategory === "সব"
    ? accordionData
    : accordionData.filter(item => item.category === activeCategory);

  const manifesto = [
    { icon: "🛡️", title: "নিরাপদ নান্দাইল", points: ["মাদক ও চাঁদাবাজমুক্ত সমাজ গঠন।", "কিশোর গ্যাং কালচার নির্মূলে জিরো টলারেন্স।", "পাড়া-মহল্লায় সিসিটিভি ও নিরাপত্তা বৃদ্ধি।"] },
    { icon: "💻", title: "আইটি ও কর্মসংস্থান", points: ["নান্দাইল হাই-টেক পার্ক ও ফ্রিল্যান্সিং হাব।", "তরুণদের জন্য আইটি স্কলারশিপ প্রদান।", "উদ্যোক্তাদের জন্য সহজ শর্তে ঋণ সুবিধা।"] },
    { icon: "🚜", title: "আধুনিক কৃষি", points: ["ফসলের ন্যায্যমূল্য নিশ্চিতে কোল্ড স্টোরেজ।", "আধুনিক সেচ ও কৃষি যন্ত্রপাতিতে ভর্তুকি।", "সরাসরি কৃষকের হাতে সার ও বীজ পৌঁছানো।"] },
    { icon: "🏗️", title: "রাস্তা ও অবকাঠামো", points: ["প্রতিটি গ্রামীণ সড়ক টেকসই পাকা করা।", "প্রয়োজনীয় ব্রিজ ও কালভার্ট নির্মাণ।", "জলাবদ্ধতা নিরসনে আধুনিক ড্রেনেজ ব্যবস্থা।"] },
    { icon: "🏥", title: "উন্নত স্বাস্থ্যসেবা", points: ["২৪ ঘণ্টা ফ্রি অ্যাম্বুলেন্স সার্ভিস।", "ইউনিয়ন পর্যায়ে নিয়মিত ফ্রি মেডিকেল ক্যাম্প।", "উপজেলা স্বাস্থ্য কমপ্লেক্সে আধুনিক সরঞ্জাম।"] },
    { icon: "🎓", title: "মানসম্মত শিক্ষা", points: ["প্রতিটি শিক্ষা প্রতিষ্ঠানে ডিজিটাল ল্যাব।", "অস্বচ্ছল মেধাবী শিক্ষার্থীদের বৃত্তি প্রদান।", "কারিগরী শিক্ষা ও দক্ষতা উন্নয়ন কেন্দ্র।"] },
    { icon: "⚖️", title: "স্বচ্ছ প্রশাসন", points: ["দালালমুক্ত ও হয়রানিমুক্ত সরকারি দপ্তর।", "'জনতার মুখোমুখি' জবাবদিহিতা অনুষ্ঠান।", "অনলাইনে দ্রুত নাগরিক সেবা প্রদান।"] },
    { icon: "💡", title: "স্মার্ট হাট-বাজার", points: ["হাট-বাজারে সোলার স্ট্রিট লাইট স্থাপন।", "পয়ঃনিষ্কাশন ও বিশুদ্ধ পানির ব্যবস্থা।", "পৌর এলাকা ও গুরুত্বপূর্ণ মোড়ে ফ্রি ওয়াইফাই।"] },
  ];

  return (
    <>
      {/* Page Banner */}
      <section className="page-hero-banner vision-hero-banner" role="region" aria-label="Page Banner">
        <div className="container">
          <FadeInUp>
            <div className="vision-hero-badge">৩১ দফা রাষ্ট্র সংস্কার কর্মসূচি</div>
            <h1 className="page-title">Vision 2030</h1>
            <p className="page-subtitle">একটি আধুনিক, স্বনির্ভর ও শান্তিময় নান্দাইল বিনির্মাণের রূপরেখা</p>
          </FadeInUp>

          {/* Progress stats row */}
          <div className="vision-stats-row">
            <div className="vision-stat">
              <span className="vision-stat-num">৩১</span>
              <span className="vision-stat-label">মূল দফা</span>
            </div>
            <div className="vision-stat-divider" aria-hidden="true"></div>
            <div className="vision-stat">
              <span className="vision-stat-num">৫</span>
              <span className="vision-stat-label">বিভাগ</span>
            </div>
            <div className="vision-stat-divider" aria-hidden="true"></div>
            <div className="vision-stat">
              <span className="vision-stat-num">২০৩০</span>
              <span className="vision-stat-label">লক্ষ্যমাত্রা</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter + 31 Dofa Accordion */}
      <section className="dofa-section" id="ideology" aria-labelledby="reforms-title">
        <div className="container">
          <FadeInUp className="section-title">
            <h2 id="reforms-title" className="title-text">
              রাষ্ট্র মেরামতের <span className="highlight-green">৩১ দফা</span>
            </h2>
            <p className="subtitle-text">শহীদ জিয়ার আদর্শে বলীয়ান হয়ে দেশনায়ক তারেক রহমান ঘোষিত রাষ্ট্র কাঠামোর রূপরেখা।</p>
          </FadeInUp>

          {/* Category Filter Tabs */}
          <div className="category-filter" role="tablist" aria-label="দফা বিভাগ ফিল্টার">
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => { setActiveCategory(cat); setActiveId(null); }}
                style={activeCategory === cat && cat !== "সব" ? {
                  backgroundColor: categoryColors[cat],
                  borderColor: categoryColors[cat],
                } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            className="dofa-accordion"
            role="presentation"
            layout
          >
            <AnimatePresence initial={false}>
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  className={`accordion-item ${activeId === item.id ? "active" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  layout
                >
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={activeId === item.id}
                    aria-controls={`accordion-panel-${item.id}`}
                    id={`accordion-btn-${item.id}`}
                    type="button"
                  >
                    <span className="accordion-header-text">
                      <span
                        className="accordion-category-dot"
                        style={{ backgroundColor: categoryColors[item.category] }}
                        aria-hidden="true"
                      ></span>
                      {item.title}
                    </span>
                    <span className="icon" aria-hidden="true">
                      <motion.i
                        className={activeId === item.id ? "fas fa-minus" : "fas fa-plus"}
                        animate={{ rotate: activeId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      ></motion.i>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {activeId === item.id && (
                      <motion.div
                        id={`accordion-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`accordion-btn-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="accordion-content-inner">
                          <span className="accordion-category-badge" style={{ backgroundColor: categoryColors[item.category] + "22", color: categoryColors[item.category], borderColor: categoryColors[item.category] + "44" }}>
                            {item.category}
                          </span>
                          <p>{item.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="dofa-accordion" style={{ borderTop: "none", borderRadius: "0 0 12px 12px" }} role="presentation">
            <div className="more-info-box">
              <p>৩১টি দফা বিস্তারিত পড়তে আমাদের পূর্ণাঙ্গ ইশতেহার ডাউনলোড করুন।</p>
              <a
                href="/assets/31-dofa-manifesto.pdf"
                download="31-dofa-manifesto.pdf"
                className="download-link"
                aria-label="পূর্ণাঙ্গ ৩১ দফা PDF ডাউনলোড করুন"
              >
                <i className="fas fa-file-pdf" aria-hidden="true"></i> পূর্ণাঙ্গ ৩১ দফা PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Grid Section */}
      <section className="manifesto-section" aria-labelledby="manifesto-title">
        <div className="container">
          <FadeInUp className="section-title">
            <h2 id="manifesto-title" className="title-text">
              স্মার্ট নান্দাইল <span className="highlight-green">ভিশন ২০৩০</span>
            </h2>
            <p className="subtitle-text">আগামীর সমৃদ্ধ ও আধুনিক নান্দাইল গড়ার অঙ্গীকারনামা</p>
          </FadeInUp>

          <StaggerContainer className="manifesto-grid" staggerDelay={0.08}>
            {manifesto.map((card, index) => (
              <StaggerItem key={index}>
                <div className="manifesto-card">
                  <div className="card-icon" aria-hidden="true">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <ul className="points-list">
                    {card.points.map((point, pi) => (
                      <li key={pi}>{point}</li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Vision Progress Indicators */}
      <section className="vision-progress-section" aria-labelledby="progress-title">
        <div className="container">
          <FadeInUp className="section-title">
            <h2 id="progress-title" className="title-text">
              ভিশন <span className="highlight-green">অগ্রগতি</span>
            </h2>
            <p className="subtitle-text">বিভাগভিত্তিক সংস্কার কর্মসূচির অগ্রগতি ও লক্ষ্যমাত্রা</p>
          </FadeInUp>

          <StaggerContainer className="progress-grid" staggerDelay={0.1}>
            {Object.entries(categoryColors).map(([category, color]) => {
              const count = accordionData.filter(item => item.category === category).length;
              const percentage = Math.round((count / accordionData.length) * 100);
              return (
                <StaggerItem key={category}>
                  <div className="progress-card">
                    <div className="progress-card-header">
                      <span className="progress-dot" style={{ backgroundColor: color }} aria-hidden="true"></span>
                      <h4 className="progress-category">{category}</h4>
                    </div>
                    <div className="progress-stats-row">
                      <span className="progress-count">{count} দফা</span>
                      <span className="progress-percentage" style={{ color }}>{percentage}%</span>
                    </div>
                    <div className="progress-bar-track" aria-hidden="true">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      ></div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Vision CTA Section */}
      <section className="vision-cta-section" aria-label="Call to Action">
        <div className="container">
          <FadeInUp>
            <div className="vision-cta-card">
              <h2>আসুন, একসাথে গড়ি আগামীর নান্দাইল</h2>
              <p>আপনার মতামত, পরামর্শ ও সহযোগিতা আমাদের এই ভিশন বাস্তবায়নে অপরিহার্য। যোগাযোগ করুন অথবা আমাদের সর্বশেষ কার্যক্রম জানতে ব্লগ পড়ুন।</p>
              <div className="vision-cta-buttons">
                <a href="/#contact" className="p-btn p-btn-primary">
                  <i className="fas fa-envelope" aria-hidden="true"></i> যোগাযোগ করুন
                </a>
                <a href="/blog" className="p-btn p-btn-outline vision-cta-outline">
                  <i className="fas fa-newspaper" aria-hidden="true"></i> ব্লগ পড়ুন
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}
