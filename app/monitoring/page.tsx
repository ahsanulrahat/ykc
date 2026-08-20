"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  AnimatedBadge,
} from "@/components/animations/MotionWrapper";
import ProjectModal from "@/components/ProjectModal";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MonitoringMap = dynamic(() => import("@/components/MonitoringMap"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--body-text)" }}>
      <span>ম্যাপ লোড হচ্ছে...</span>
    </div>
  ),
});

// ─── Project Data ────────────────────────────────────────
type ProjectStatus = "completed" | "ongoing";
type ProjectCategory = "সড়ক ও অবকাঠামো" | "খাল ও জলাবদ্ধতা" | "পানি/বিদ্যুৎ" | "শিক্ষা" | "ধর্মীয়" | "স্বাস্থ্য";

interface Project {
  id: number;
  title: string;
  location: string;
  ward: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number;
  lat: number;
  lng: number;
  description: string;
  images: string[];
  updatedAt: string;
}

const projects: Project[] = [
  { id: 1, title: "নান্দাইল পৌরসভা মেখল ০১নং ওয়ার্ড, ভূমি সারাং সড়ক সংস্কার এর কাজ সম্পন্ন", location: "মেখল", ward: "০১", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5890, lng: 90.1750, description: "নান্দাইলের মাটি ও মানুষের জীবনযাত্রার মান উন্নয়নই আমাদের মূল লক্ষ্য। সেই পরিক্রমায় মাননীয় প্রতিমন্ত্রী ইয়াসের খান চৌধুরী, এমপি এর নির্দেশনা ও তত্ত্বাবধানে নান্দাইল পৌরসভা মেখল ০১নং ওয়ার্ডের ভূমি সারাং সড়ক সংস্কার এর কাজ সফলভাবে সম্পন্ন হয়েছে। এই সড়ক সংস্কারের ফলে এলাকাবাসীর যাতায়াত ব্যবস্থার উল্লেখযোগ্য উন্নতি হয়েছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-road.jpg"], updatedAt: "৭ আগস্ট ২০২৬" },
  { id: 2, title: "১০ নং উত্তর মাদার্শা ইউনিয়ন ২ নং ওয়ার্ডের বাচন আলী টেন্ডাল বাড়ি সংযোগ সড়ক এর আর.সি.সি চালাই কাজ সম্পন্ন", location: "উত্তর মাদার্শা", ward: "০২", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5780, lng: 90.1680, description: "উত্তর মাদার্শা ইউনিয়নের ২ নং ওয়ার্ডে বাচন আলী টেন্ডাল বাড়ি সংযোগ সড়কের আর.সি.সি চালাই কাজ সফলভাবে সম্পন্ন হয়েছে। এই প্রকল্পটি এলাকার যোগাযোগ ব্যবস্থার আমূল পরিবর্তন এনেছে এবং স্থানীয় জনগণের দৈনন্দিন জীবনযাত্রাকে সহজ করেছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-road.jpg"], updatedAt: "৭ আগস্ট ২০২৬" },
  { id: 3, title: "১৪ নং শিকারপুর ইউনিয়নের পশ্চিম কুয়াইশ ৯ নং ওয়ার্ড হতে খাল পরিষ্কার ও খনন কাজ শুরু হয়েছে", location: "শিকারপুর", ward: "০৯", category: "খাল ও জলাবদ্ধতা", status: "ongoing", progress: 38, lat: 24.6010, lng: 90.1520, description: "জলাবদ্ধতা নিরসন, দ্রুত পানি নিষ্কাশন ও বন্যার হাত থেকে রক্ষার্থে মাননীয় প্রতিমন্ত্রী ইয়াসের খান চৌধুরী, এমপি এর নির্দেশনা ও তত্ত্বাবধানে ১৪ নং শিকারপুর ইউনিয়নের পশ্চিম কুয়াইশ ৯ নং ওয়ার্ড হতে খাল পরিষ্কার ও খনন কাজ শুরু হয়েছে। এই প্রকল্প সম্পন্ন হলে এলাকার কৃষি উৎপাদন ও জনজীবনে ইতিবাচক প্রভাব পড়বে।", images: ["/assets/monitoring-canal.jpg", "/assets/monitoring-canal.jpg"], updatedAt: "৭ আগস্ট ২০২৬" },
  { id: 4, title: "ধলই ইউনিয়নের ১ নং ওয়ার্ডে খলিল হাজী জামে মসজিদ সংযোগ সড়কের আর সি সি চালাইয়ের কাজ সম্পন্ন", location: "ধলই", ward: "০১", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5720, lng: 90.1840, description: "ধলই ইউনিয়নের ১ নং ওয়ার্ডের খলিল হাজী জামে মসজিদ সংযোগ সড়কের আর সি সি চালাইয়ের কাজ সম্পন্ন হয়েছে। এই সড়কটি মসজিদে যাতায়াতকারী নামাজীদের জন্য অত্যন্ত উপকারী হয়েছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-mosque.jpg"], updatedAt: "২৯ জুলাই ২০২৬" },
  { id: 5, title: "১ নং ফরহাদাবাদ ৫ নং ওয়ার্ডে আলহাজ্ব সিদ্দিক আহম্মদ সওদাগর বাড়ি সড়ক আরসিসি চালাইকরণ প্রকল্প সফলভাবে সম্পন্ন", location: "ফরহাদাবাদ", ward: "০৫", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5950, lng: 90.1610, description: "ফরহাদাবাদ ইউনিয়নের ৫ নং ওয়ার্ডে আলহাজ্ব সিদ্দিক আহম্মদ সওদাগর বাড়ি সড়ক আরসিসি চালাইকরণ প্রকল্প সফলভাবে সম্পন্ন হয়েছে। মাননীয় প্রতিমন্ত্রীর নির্দেশনায় এই প্রকল্পটি দ্রুততার সাথে সম্পন্ন করা হয়েছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-road.jpg"], updatedAt: "২৯ জুলাই ২০২৬" },
  { id: 6, title: "নান্দাইল উপজেলার উত্তর মাদার্শা ০১ নং ওয়ার্ডে মাসুখানা হাচারী সড়ক সড়ক সংস্কার এর কাজ সম্পন্ন", location: "উত্তর মাদার্শা", ward: "০১", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5810, lng: 90.1700, description: "উত্তর মাদার্শা ইউনিয়নের ০১ নং ওয়ার্ডে মাসুখানা হাচারী সড়ক সংস্কার এর কাজ সম্পন্ন হয়েছে। জনগণের দীর্ঘদিনের দাবি অনুযায়ী এই সড়কটি সংস্কার করা হয়েছে।", images: ["/assets/monitoring-road.jpg"], updatedAt: "২৮ জুলাই ২০২৬" },
  { id: 7, title: "১৪ নং শিকারপুর ৫ নং ওয়ার্ড জান আলী শাহ বাড়ীর সড়ক এর আর সি সি চালায়ের কাজ সম্পন্ন", location: "শিকারপুর", ward: "০৫", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5980, lng: 90.1550, description: "শিকারপুর ইউনিয়নের ৫ নং ওয়ার্ডে জান আলী শাহ বাড়ীর সড়ক এর আর সি সি চালায়ের কাজ সম্পন্ন হয়েছে। এই সড়কটি এলাকাবাসীর যাতায়াতের জন্য অত্যন্ত গুরুত্বপূর্ণ ছিল।", images: ["/assets/monitoring-road.jpg"], updatedAt: "৫ জুলাই ২০২৬" },
  { id: 8, title: "নান্দাইল উপজেলার ৭নং ওয়ার্ড দক্ষিণ মাদার্শা আকবরিয়া সড়ক সংস্কার এর কাজ সম্পন্ন", location: "দক্ষিণ মাদার্শা", ward: "০৭", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5690, lng: 90.1760, description: "দক্ষিণ মাদার্শা ইউনিয়নের ৭নং ওয়ার্ডে আকবরিয়া সড়ক সংস্কার এর কাজ সম্পন্ন হয়েছে। বর্ষাকালে এই সড়কটি যাতায়াতের অনুপযোগী ছিল, এখন সেই সমস্যার স্থায়ী সমাধান হয়েছে।", images: ["/assets/monitoring-road.jpg"], updatedAt: "৫ জুলাই ২০২৬" },
  { id: 9, title: "নান্দাইল উপজেলার ১৪ নং শিকারপুর ৮ নং ওয়ার্ড বর্ণিক পাড়া দক্ষিণ কুয়াইশ সড়ক এর ২০০ ফিট রাস্তা সংস্কারের কাজ চলমান", location: "শিকারপুর", ward: "০৮", category: "সড়ক ও অবকাঠামো", status: "ongoing", progress: 52, lat: 24.6030, lng: 90.1480, description: "শিকারপুর ইউনিয়নের ৮ নং ওয়ার্ড বর্ণিক পাড়া দক্ষিণ কুয়াইশ সড়ক এর ২০০ ফিট রাস্তা সংস্কারের কাজ চলমান রয়েছে। প্রকল্পটি দ্রুত গতিতে এগিয়ে চলছে এবং শীঘ্রই সম্পন্ন হবে বলে আশা করা যাচ্ছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-road.jpg"], updatedAt: "৫ জুলাই ২০২৬" },
  { id: 10, title: "নান্দাইল পৌরসভা ০৩ নং ওয়ার্ডে প্রাথমিক বিদ্যালয়ের মাঠ ভরাট ও সংস্কার", location: "পৌরসভা", ward: "০৩", category: "শিক্ষা", status: "completed", progress: 100, lat: 24.5850, lng: 90.1720, description: "নান্দাইল পৌরসভা ০৩ নং ওয়ার্ডে প্রাথমিক বিদ্যালয়ের মাঠ ভরাট ও সংস্কার কাজ সম্পন্ন হয়েছে। শিশুদের জন্য একটি নিরাপদ ও সুন্দর শিক্ষা পরিবেশ তৈরি করা আমাদের অগ্রাধিকার।", images: ["/assets/monitoring-school.jpg", "/assets/monitoring-school.jpg"], updatedAt: "৫ জুন ২০২৬" },
  { id: 11, title: "গুমানমর্দন ইউনিয়নে কেন্দ্রীয় জামে মসজিদের সংস্কার ও উন্নয়ন কার্যক্রম সম্পন্ন", location: "গুমানমর্দন", ward: "০৪", category: "ধর্মীয়", status: "completed", progress: 100, lat: 24.5760, lng: 90.1900, description: "গুমানমর্দন ইউনিয়নে কেন্দ্রীয় জামে মসজিদের সংস্কার ও উন্নয়ন কার্যক্রম সম্পন্ন হয়েছে। মসজিদের টাইলস, ওয়াশরুম এবং মূল ভবনের সংস্কার কাজ করা হয়েছে।", images: ["/assets/monitoring-mosque.jpg", "/assets/monitoring-mosque.jpg"], updatedAt: "২০ মে ২০২৬" },
  { id: 12, title: "মির্জাপুর ইউনিয়নে পানীয় জলের গভীর নলকূপ স্থাপন প্রকল্প চলমান", location: "মির্জাপুর", ward: "০২", category: "পানি/বিদ্যুৎ", status: "ongoing", progress: 65, lat: 24.5830, lng: 90.1550, description: "মির্জাপুর ইউনিয়নে বিশুদ্ধ পানীয় জলের সংকট নিরসনে গভীর নলকূপ স্থাপন প্রকল্প চলমান রয়েছে। এই প্রকল্পটি সম্পন্ন হলে শতাধিক পরিবার বিশুদ্ধ পানি পাবে।", images: ["/assets/monitoring-water.jpg", "/assets/monitoring-water.jpg"], updatedAt: "১৫ জুলাই ২০২৬" },
  { id: 13, title: "নাঙালমোড়া ইউনিয়নে কমিউনিটি ক্লিনিকের সংস্কার ও আধুনিকায়ন প্রকল্প", location: "নাঙালমোড়া", ward: "০৬", category: "স্বাস্থ্য", status: "ongoing", progress: 45, lat: 24.5920, lng: 90.1430, description: "নাঙালমোড়া ইউনিয়নে কমিউনিটি ক্লিনিকের সংস্কার ও আধুনিকায়ন প্রকল্প চলমান রয়েছে। ক্লিনিকে নতুন চিকিৎসা সরঞ্জাম সংযোজন এবং ভবন সংস্কার করা হচ্ছে।", images: ["/assets/monitoring-clinic.jpg", "/assets/monitoring-clinic.jpg"], updatedAt: "১০ জুলাই ২০২৬" },
  { id: 14, title: "ছিপাতলী ইউনিয়ন ০৩ নং ওয়ার্ডে কবরস্থানের উন্নয়ন কাজ সম্পন্ন", location: "ছিপাতলী", ward: "০৩", category: "ধর্মীয়", status: "completed", progress: 100, lat: 24.5680, lng: 90.1620, description: "ছিপাতলী ইউনিয়ন ০৩ নং ওয়ার্ডে কবরস্থানের সীমানা প্রাচীর নির্মাণ, রাস্তা সংস্কার ও সামগ্রিক উন্নয়ন কাজ সম্পন্ন হয়েছে।", images: ["/assets/monitoring-mosque.jpg"], updatedAt: "১ মে ২০২৬" },
  { id: 15, title: "গড়দুয়ারা ইউনিয়নে বিদ্যুৎ লাইন সম্প্রসারণ ও ট্রান্সফরমার স্থাপন প্রকল্প চলমান", location: "গড়দুয়ারা", ward: "০১", category: "পানি/বিদ্যুৎ", status: "ongoing", progress: 30, lat: 24.5750, lng: 90.1980, description: "গড়দুয়ারা ইউনিয়নে বিদ্যুৎ লাইন সম্প্রসারণ ও ট্রান্সফরমার স্থাপন প্রকল্প চলমান। এই প্রকল্পের মাধ্যমে আরও ২০০টি পরিবার বিদ্যুৎ সুবিধা পাবে।", images: ["/assets/monitoring-water.jpg"], updatedAt: "২০ জুলাই ২০২৬" },
  { id: 16, title: "ফতেহপুর ইউনিয়নে হাইস্কুল মাঠ ভরাট ও বাউন্ডারি ওয়াল নির্মাণ সম্পন্ন", location: "ফতেহপুর", ward: "০৫", category: "শিক্ষা", status: "completed", progress: 100, lat: 24.5640, lng: 90.1850, description: "ফতেহপুর ইউনিয়নে হাইস্কুল মাঠ ভরাট ও বাউন্ডারি ওয়াল নির্মাণ সম্পন্ন হয়েছে। শিক্ষার্থীদের জন্য একটি নিরাপদ ও আধুনিক শিক্ষা পরিবেশ গড়ে তোলা হচ্ছে।", images: ["/assets/monitoring-school.jpg", "/assets/monitoring-school.jpg"], updatedAt: "১৫ এপ্রিল ২০২৬" },
  { id: 17, title: "চিকনদন্ডী ইউনিয়নে খালের পাশে পাকা বাঁধ নির্মাণ কাজ চলমান", location: "চিকনদন্ডী", ward: "০৪", category: "খাল ও জলাবদ্ধতা", status: "ongoing", progress: 58, lat: 24.5900, lng: 90.2020, description: "চিকনদন্ডী ইউনিয়নে খালের পাশে পাকা বাঁধ নির্মাণ কাজ চলমান রয়েছে। এই বাঁধ নির্মাণের ফলে বর্ষাকালে খালের পানি উপচে পড়া রোধ হবে এবং এলাকাবাসীর জলাবদ্ধতার সমস্যা দূর হবে।", images: ["/assets/monitoring-canal.jpg", "/assets/monitoring-canal.jpg"], updatedAt: "৫ জুলাই ২০২৬" },
  { id: 18, title: "বুড়িশ্চর ইউনিয়নে সংযোগ সড়ক আরসিসি চালাইকরণ প্রকল্প সম্পন্ন", location: "বুড়িশ্চর", ward: "০২", category: "সড়ক ও অবকাঠামো", status: "completed", progress: 100, lat: 24.5710, lng: 90.1400, description: "বুড়িশ্চর ইউনিয়নে সংযোগ সড়ক আরসিসি চালাইকরণ প্রকল্প সম্পন্ন হয়েছে। দীর্ঘদিন ধরে এই সড়কটি মাটির রাস্তা ছিল, এখন পাকা সড়কে রূপান্তরিত হয়েছে।", images: ["/assets/monitoring-road.jpg", "/assets/monitoring-road.jpg"], updatedAt: "১ জুলাই ২০২৬" },
];

const categories: ProjectCategory[] = [
  "সড়ক ও অবকাঠামো",
  "খাল ও জলাবদ্ধতা",
  "পানি/বিদ্যুৎ",
  "শিক্ষা",
  "ধর্মীয়",
  "স্বাস্থ্য",
];

// Category colors for allocation chart
const categoryColors: Record<ProjectCategory, string> = {
  "সড়ক ও অবকাঠামো": "#006837",
  "খাল ও জলাবদ্ধতা": "#1565c0",
  "পানি/বিদ্যুৎ": "#e08a1e",
  "শিক্ষা": "#7b1fa2",
  "ধর্মীয়": "#c62828",
  "স্বাস্থ্য": "#00838f",
};

const categoryIcons: Record<ProjectCategory, string> = {
  "সড়ক ও অবকাঠামো": "🛣️",
  "খাল ও জলাবদ্ধতা": "🌊",
  "পানি/বিদ্যুৎ": "💧",
  "শিক্ষা": "📚",
  "ধর্মীয়": "🕌",
  "স্বাস্থ্য": "🏥",
};

// ─── Countdown Helper ─────────────────────────────────────
const OATH_DATE = new Date("2026-01-27");
const TOTAL_DAYS = 180;

function useCountdown() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - OATH_DATE.getTime()) / (1000 * 60 * 60 * 24));
      setElapsed(Math.min(diff, TOTAL_DAYS));
    };
    calc();
    const interval = setInterval(calc, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { elapsed, remaining: Math.max(TOTAL_DAYS - elapsed, 0), percentage: Math.min((elapsed / TOTAL_DAYS) * 100, 100) };
}

// ─── Page Component ──────────────────────────────────────
export default function MonitoringPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProjectCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState<"all" | ProjectStatus>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const countdown = useCountdown();

  // Derived counts
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;

  // Category counts for allocation
  const categoryCounts = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      count: projects.filter((p) => p.category === cat).length,
      color: categoryColors[cat],
      icon: categoryIcons[cat],
    }));
  }, []);

  // Sidebar filtered projects
  const filteredSidebar = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, categoryFilter, searchQuery]);

  // Grid filtered projects
  const filteredGrid = useMemo(() => {
    if (gridFilter === "all") return projects;
    return projects.filter((p) => p.status === gridFilter);
  }, [gridFilter]);

  // SVG ring calculations
  const ringRadius = 72;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (countdown.percentage / 100) * ringCircumference;

  // Donut chart calculations
  const donutRadius = 80;
  const donutCircumference = 2 * Math.PI * donutRadius;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="monitoring-hero" aria-label="Monitoring Dashboard Banner">
        <div className="monitoring-hero-orb monitoring-hero-orb-1" aria-hidden="true" />
        <div className="monitoring-hero-orb monitoring-hero-orb-2" aria-hidden="true" />
        <div className="monitoring-hero-content">
          <AnimatedBadge delay={0.1}>
            <div className="monitoring-hero-badge">📊 উন্নয়ন অগ্রগতি পরিদর্শন</div>
          </AnimatedBadge>
          <FadeInUp delay={0.2}>
            <h1>
              প্রথম <span className="txt-gold">১৮০ দিনের</span> অগ্রগতি
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.35}>
            <p>
              ময়মনসিংহ-৯ (নান্দাইল) আসনে চলমান ও সম্পন্ন উন্নয়ন প্রকল্পসমূহের সচিত্র প্রতিবেদন
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="monitoring-stats-section" aria-label="Project Statistics">
        <div className="container">
          <StaggerContainer className="monitoring-stats-grid" staggerDelay={0.12}>
            <StaggerItem>
              <div className="monitoring-stat-card stat-total">
                <div className="monitoring-stat-num">
                  <AnimatedCounter target={totalProjects} />
                </div>
                <div className="monitoring-stat-label">মোট প্রকল্প</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="monitoring-stat-card stat-completed">
                <div className="monitoring-stat-num">
                  <AnimatedCounter target={completedProjects} />
                </div>
                <div className="monitoring-stat-label">সম্পন্ন</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="monitoring-stat-card stat-ongoing">
                <div className="monitoring-stat-num">
                  <AnimatedCounter target={ongoingProjects} />
                </div>
                <div className="monitoring-stat-label">চলমান</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 180-Day Countdown ─── */}
      <section className="monitoring-countdown-section" aria-label="180 Day Countdown">
        <div className="container">
          <FadeInUp>
            <div className="countdown-card">
              <div className="countdown-ring-wrap">
                <svg className="countdown-ring-svg" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#006837" />
                      <stop offset="100%" stopColor="#4caf50" />
                    </linearGradient>
                  </defs>
                  <circle className="countdown-ring-bg" cx="80" cy="80" r={ringRadius} />
                  <circle
                    className="countdown-ring-fill"
                    cx="80"
                    cy="80"
                    r={ringRadius}
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                  />
                </svg>
                <div className="countdown-ring-center">
                  <div className="countdown-ring-number">{countdown.elapsed}</div>
                  <div className="countdown-ring-label">দিন অতিবাহিত</div>
                </div>
              </div>

              <div className="countdown-text-side">
                <h3>
                  প্রথম <span>১৮০ দিনের</span> কর্মপরিকল্পনা
                </h3>
                <p>
                  ২৭ জানুয়ারি ২০২৬ থেকে শুরু হওয়া প্রথম ১৮০ দিনের কর্মপরিকল্পনার অগ্রগতি। জনগণের সেবায় প্রতিশ্রুতি বাস্তবায়নে নিরলস কাজ চলছে।
                </p>
                <div className="countdown-stats-row">
                  <div className="countdown-mini-stat">
                    <b>{countdown.elapsed}</b>
                    <span>দিন সম্পন্ন</span>
                  </div>
                  <div className="countdown-mini-stat">
                    <b>{countdown.remaining}</b>
                    <span>দিন বাকি</span>
                  </div>
                  <div className="countdown-mini-stat">
                    <b>{Math.round(countdown.percentage)}%</b>
                    <span>অগ্রগতি</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Map + Sidebar Section ─── */}
      <section className="monitoring-map-section" aria-label="Project Map and List">
        <div className="container">
          <FadeInUp>
            <div className="monitoring-map-wrapper">
              {/* Sidebar */}
              <aside className="monitoring-sidebar">
                <div className="monitoring-sidebar-brand">
                  <h3>নান্দাইল উন্নয়ন কার্যক্রম</h3>
                  <p>ইয়াসের খান চৌধুরী · ময়মনসিংহ-৯</p>
                </div>

                {/* Mini stats */}
                <div className="monitoring-sidebar-stats">
                  <div className="monitoring-sidebar-stat s-total">
                    <b>{totalProjects}</b>
                    <span>মোট প্রকল্প</span>
                  </div>
                  <div className="monitoring-sidebar-stat s-comp">
                    <b>{completedProjects}</b>
                    <span>সম্পন্ন</span>
                  </div>
                  <div className="monitoring-sidebar-stat s-ong">
                    <b>{ongoingProjects}</b>
                    <span>চলমান</span>
                  </div>
                </div>

                {/* Search */}
                <div className="monitoring-search-box">
                  <i className="fas fa-search search-icon" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="প্রকল্প বা এলাকা খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="monitoring-search"
                  />
                </div>

                {/* Status chips */}
                <div className="monitoring-chips">
                  <button
                    className={`monitoring-chip ${statusFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    সব
                  </button>
                  <button
                    className={`monitoring-chip ${statusFilter === "completed" ? "is-active" : ""}`}
                    onClick={() => setStatusFilter("completed")}
                  >
                    সম্পন্ন
                  </button>
                  <button
                    className={`monitoring-chip ${statusFilter === "ongoing" ? "is-active amber" : ""}`}
                    onClick={() => setStatusFilter("ongoing")}
                  >
                    চলমান
                  </button>
                </div>

                {/* Category chips */}
                <div className="monitoring-catbar">
                  <button
                    className={`monitoring-cat-chip ${categoryFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setCategoryFilter("all")}
                  >
                    সব ধরন
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`monitoring-cat-chip ${categoryFilter === cat ? "is-active" : ""}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Count */}
                <div className="monitoring-count-text">
                  দেখানো হচ্ছে {filteredSidebar.length} টি প্রকল্প
                </div>

                {/* Project list */}
                <div className="monitoring-project-list">
                  {filteredSidebar.map((p) => (
                    <div
                      className="monitoring-project-item"
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      style={{ cursor: "pointer" }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter") setSelectedProject(p); }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span className={`status-dot ${p.status}`} style={{ marginTop: 5 }} />
                        <h4>{p.title}</h4>
                      </div>
                      <div className="monitoring-project-item-meta">
                        <span className="location-badge">📍 {p.location}</span>
                        <span className="cat-badge">{p.category}</span>
                        <span className={`pct-badge ${p.status === "completed" ? "complete" : "ongoing"}`}>
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredSidebar.length === 0 && (
                    <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--body-text)", fontSize: "0.85rem" }}>
                      কোনো প্রকল্প পাওয়া যায়নি।
                    </div>
                  )}
                </div>
              </aside>

              {/* Map */}
              <div className="monitoring-map-container">
                <MonitoringMap
                  projects={filteredSidebar}
                  onProjectSelect={(id: number) => {
                    const proj = projects.find((p) => p.id === id);
                    if (proj) setSelectedProject(proj);
                  }}
                />
                <div className="monitoring-map-label">ময়মনসিংহ-৯ (নান্দাইল উপজেলা)</div>
                <div className="monitoring-map-legend">
                  <div>
                    <i style={{ background: "#0e8a4a" }} /> সম্পন্ন
                  </div>
                  <div>
                    <i style={{ background: "#e08a1e" }} /> চলমান
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Category Allocation Breakdown ─── */}
      <section className="monitoring-allocation-section" aria-labelledby="allocation-title">
        <div className="container">
          <FadeInUp>
            <div className="monitoring-section-header">
              <h2 id="allocation-title">
                ক্যাটাগরি অনুযায়ী <span className="highlight-green">প্রকল্প বিভাজন</span>
              </h2>
              <p>নান্দাইল উপজেলায় বিভিন্ন খাতে চলমান ও সম্পন্ন প্রকল্পের পরিসংখ্যান</p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="allocation-grid">
              {/* Bar chart */}
              <div className="allocation-bars">
                {categoryCounts.map((cat) => (
                  <div className="alloc-bar-item" key={cat.category}>
                    <div className="alloc-bar-header">
                      <span className="alloc-bar-label">
                        <span className="alloc-icon" style={{ background: cat.color + "18" }}>{cat.icon}</span>
                        {cat.category}
                      </span>
                      <span className="alloc-bar-count">{cat.count} টি</span>
                    </div>
                    <div className="alloc-bar-track">
                      <div
                        className="alloc-bar-fill"
                        style={{
                          width: `${(cat.count / totalProjects) * 100}%`,
                          background: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Donut chart */}
              <div className="alloc-donut-wrap">
                <svg className="alloc-donut-svg" viewBox="0 0 200 200">
                  {(() => {
                    let cumulativeOffset = 0;
                    return categoryCounts.map((cat) => {
                      const fraction = cat.count / totalProjects;
                      const dashLength = fraction * donutCircumference;
                      const gapLength = donutCircumference - dashLength;
                      const offset = cumulativeOffset;
                      cumulativeOffset += dashLength;
                      return (
                        <circle
                          key={cat.category}
                          cx="100"
                          cy="100"
                          r={donutRadius}
                          fill="none"
                          stroke={cat.color}
                          strokeWidth="20"
                          strokeDasharray={`${dashLength} ${gapLength}`}
                          strokeDashoffset={-offset}
                          transform="rotate(-90 100 100)"
                          style={{ transition: "stroke-dashoffset 1s ease" }}
                        />
                      );
                    });
                  })()}
                  <text className="alloc-donut-center-text" x="100" y="95" textAnchor="middle" dominantBaseline="central">
                    {totalProjects}
                  </text>
                  <text className="alloc-donut-center-label" x="100" y="118" textAnchor="middle" dominantBaseline="central">
                    মোট প্রকল্প
                  </text>
                </svg>

                <div className="alloc-legend">
                  {categoryCounts.map((cat) => (
                    <div className="alloc-legend-item" key={cat.category}>
                      <span className="alloc-legend-dot" style={{ background: cat.color }} />
                      {cat.category} ({cat.count})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Project Card Grid ─── */}
      <section className="monitoring-cards-section" aria-labelledby="monitoring-grid-title">
        <div className="container">
          <FadeInUp>
            <div className="monitoring-section-header">
              <h2 id="monitoring-grid-title">
                উন্নয়ন <span className="highlight-green">প্রকল্পসমূহ</span>
              </h2>
              <p>নান্দাইল উপজেলায় সম্পন্ন ও চলমান প্রকল্পের বিস্তারিত তথ্য</p>
            </div>
          </FadeInUp>

          {/* Filter tabs */}
          <FadeInUp delay={0.1}>
            <div className="monitoring-filter-bar">
              <span className="filter-label">FILTER</span>
              <button
                className={`monitoring-filter-tab ${gridFilter === "all" ? "is-active" : ""}`}
                onClick={() => setGridFilter("all")}
              >
                All
              </button>
              <button
                className={`monitoring-filter-tab ${gridFilter === "completed" ? "is-active" : ""}`}
                onClick={() => setGridFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`monitoring-filter-tab ${gridFilter === "ongoing" ? "is-active" : ""}`}
                onClick={() => setGridFilter("ongoing")}
              >
                On Going
              </button>
            </div>
          </FadeInUp>

          {/* Cards grid */}
          <StaggerContainer className="monitoring-card-grid" staggerDelay={0.08}>
            {filteredGrid.map((p) => (
              <StaggerItem key={p.id}>
                <div className="monitoring-card">
                  {/* Thumb with actual image */}
                  <div
                    className="monitoring-card-thumb"
                    style={{
                      backgroundImage: p.images.length > 0 ? `url(${p.images[0]})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <span className={`monitoring-card-status-overlay ${p.status}`}>
                      {p.status === "completed" ? "COMPLETED" : "ONGOING"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="monitoring-card-body">
                    <span className={`status-chip ${p.status}`}>
                      {p.status === "completed" ? "Completed" : "Ongoing"}
                    </span>
                    <h3>{p.title}</h3>
                    <button
                      className="monitoring-card-btn"
                      onClick={() => setSelectedProject(p)}
                    >
                      KNOW MORE / বিস্তারিত জানুন
                    </button>

                    {/* Progress */}
                    <div className="monitoring-progress-wrap">
                      <div className="monitoring-progress-header">
                        <span>{p.status === "completed" ? "Completed" : "Progress"}</span>
                        <span className="pct-val">{p.progress}%</span>
                      </div>
                      <div className="monitoring-progress-bar">
                        <div
                          className={`monitoring-progress-fill ${p.status}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}

            {filteredGrid.length === 0 && (
              <div className="monitoring-no-results">
                <div className="icon">🔍</div>
                <p>কোনো প্রকল্প পাওয়া যায়নি</p>
              </div>
            )}
          </StaggerContainer>

          {/* Social row */}
          <FadeInUp delay={0.2}>
            <div className="monitoring-social-row">
              <a
                href="https://www.facebook.com/Nandailykc"
                className="monitoring-social-btn fb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                href="https://youtube.com"
                className="monitoring-social-btn yt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube" />
              </a>
              <a
                href="https://instagram.com"
                className="monitoring-social-btn ig"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ─── Project Detail Modal ─── */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
