"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryLightboxProps {
  totalImages: number;
}

export default function GalleryLightbox({ totalImages }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev !== null && prev < totalImages ? prev + 1 : 1));
  }, [totalImages]);
  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev !== null && prev > 1 ? prev - 1 : totalImages));
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, goNext, goPrev]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="journey-grid">
        {Array.from({ length: totalImages }, (_, i) => i + 1).map((num) => (
          <div
            className="gallery-item"
            key={num}
            tabIndex={0}
            role="button"
            aria-label={`পথচলা গ্যালারি ছবি ${num} — বড় করে দেখতে ক্লিক করুন`}
            onClick={() => openLightbox(num)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(num);
              }
            }}
          >
            <Image
              src={`/assets/gallery-${num}.jpg`}
              alt={`Journey Moment ${num}`}
              width={300}
              height={400}
              loading="lazy"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && activeIndex !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="গ্যালারি ছবি ভিউয়ার"
          >
            {/* Close button */}
            <button
              className="lightbox-close"
              onClick={close}
              aria-label="বন্ধ করুন"
              type="button"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>

            {/* Prev button */}
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="আগের ছবি"
              type="button"
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>

            {/* Image container */}
            <motion.div
              className="lightbox-content"
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/assets/gallery-${activeIndex}.jpg`}
                alt={`Journey Moment ${activeIndex}`}
                width={900}
                height={700}
                style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain" }}
                priority
              />
              <div className="lightbox-counter">
                {activeIndex} / {totalImages}
              </div>
            </motion.div>

            {/* Next button */}
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="পরের ছবি"
              type="button"
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
