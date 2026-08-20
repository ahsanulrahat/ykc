"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  location: string;
  ward: string;
  category: string;
  status: "completed" | "ongoing";
  progress: number;
  description: string;
  images: string[];
  updatedAt: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImage(0);
  }, [project?.id]);

  // ESC key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!project) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, currentImage, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  const nextImage = useCallback(() => {
    if (!project) return;
    setCurrentImage((prev) => (prev + 1) % project.images.length);
  }, [project]);

  const prevImage = useCallback(() => {
    if (!project) return;
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="বন্ধ করুন"
            >
              ✕
            </button>

            {/* Image Gallery */}
            {project.images.length > 0 && (
              <div className="modal-gallery">
                <Image
                  src={project.images[currentImage]}
                  alt={`${project.title} - ছবি ${currentImage + 1}`}
                  className="modal-gallery-img"
                  width={780}
                  height={488}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  priority
                />

                {/* Counter */}
                <div className="modal-gallery-counter">
                  {currentImage + 1} / {project.images.length}
                </div>

                {/* Arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      className="modal-gallery-arrow prev"
                      onClick={prevImage}
                      aria-label="আগের ছবি"
                    >
                      ‹
                    </button>
                    <button
                      className="modal-gallery-arrow next"
                      onClick={nextImage}
                      aria-label="পরের ছবি"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Dots */}
                {project.images.length > 1 && (
                  <div className="modal-gallery-dots">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        className={`modal-gallery-dot ${i === currentImage ? "active" : ""}`}
                        onClick={() => setCurrentImage(i)}
                        aria-label={`ছবি ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Body */}
            <div className="modal-body">
              {/* Meta badges */}
              <div className="modal-meta-row">
                <span className={`modal-meta-badge status-${project.status}`}>
                  {project.status === "completed" ? "✅ সম্পন্ন" : "🔄 চলমান"}
                </span>
                <span className="modal-meta-badge location">
                  📍 {project.location} — ওয়ার্ড {project.ward}
                </span>
                <span className="modal-meta-badge category">
                  {project.category}
                </span>
                <span className="modal-meta-badge date">
                  🗓️ {project.updatedAt}
                </span>
              </div>

              {/* Title */}
              <h2 className="modal-title">{project.title}</h2>

              {/* Description */}
              <p className="modal-description">{project.description}</p>

              {/* Progress */}
              <div className="modal-progress-section">
                <div className="modal-progress-header">
                  <span>{project.status === "completed" ? "Completed" : "Progress"}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="modal-progress-bar">
                  <div
                    className={`modal-progress-fill ${project.status}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
