"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { MobileMenuWrapper, MenuBackdrop } from "@/components/animations/MotionWrapper";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home", matchExact: true },
  { href: "/vision-2030", label: "Vision 2030", matchExact: true },
  { href: "/blog", label: "Blog", matchExact: false },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to hash changes or page mount to scroll smoothly to hash targets (e.g. #contact)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash === "#contact") {
        const target = document.getElementById("contact");
        if (target) {
          const headerOffset = 90;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    };

    // Run after a slight delay to allow hydration and rendering to stabilize
    const timer = setTimeout(handleHashScroll, 300);

    window.addEventListener("hashchange", handleHashScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Smooth scroll to hash target accounting for fixed header height
  const smoothScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMenu();
    if (pathname !== "/") {
      router.push("/" + hash);
      return;
    }
    const target = document.querySelector(hash.replace("/", "").replace("#", "#"));
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, [pathname, router, closeMenu]);

  const staggerDelays = [0, 0.06, 0.12, 0.18];

  return (
    <>
      <header className={`site-header ${isSticky ? "sticky" : ""}`} role="banner">
        <div className="container header-container">
          {/* Logo */}
          <Link
            href="/"
            className="logo-link"
            onClick={closeMenu}
            aria-label="Yaser Khan Chowdhury - Home"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              className="logo-img"
              width={60}
              height={60}
              priority
              style={{ height: "auto" }}
            />
            <span className="logo-text">Yaser Khan Chowdhury</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="nav-wrapper desktop-only"
            role="navigation"
            aria-label="Main Navigation"
          >
            <ul className="nav-menu">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive(link.href, link.matchExact) ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#contact" className="nav-link contact-cta" onClick={(e) => smoothScrollTo(e, "#contact")}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Header Controls */}
          <div className="header-controls">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`সুইচ করুন ${theme === "light" ? "ডার্ক" : "লাইট"} মোডে`}
              title={`সুইচ করুন ${theme === "light" ? "ডার্ক" : "লাইট"} মোডে`}
              type="button"
            >
              {theme === "light" ? (
                <i className="fas fa-moon" aria-hidden="true"></i>
              ) : (
                <i className="fas fa-sun" aria-hidden="true"></i>
              )}
            </button>

            {/* Desktop Social Icons */}
            <div className="social-icons-desktop">
              <a
                href="https://www.facebook.com/Nandailykc"
                className="social-icon-btn"
                aria-label="Facebook Page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter Profile">
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
            </div>

            {/* Hamburger Button */}
            <button
              className={`mobile-toggle ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <MenuBackdrop isOpen={isMenuOpen} onClose={closeMenu} />

      {/* Mobile Menu Panel */}
      <MobileMenuWrapper isOpen={isMenuOpen}>
        <div id="mobile-nav-panel" className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* Panel Header */}
          <div className="mobile-nav-header">
            <Link href="/" className="logo-link" onClick={closeMenu}>
              <Image src="/assets/logo.png" alt="Logo" width={40} height={40} style={{ height: "auto" }} />
              <span className="mobile-nav-logo-text">YKC</span>
            </Link>
            <button
              className="mobile-nav-close"
              onClick={closeMenu}
              aria-label="মেনু বন্ধ করুন"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            <ul>
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: staggerDelays[index] }}
                >
                  <Link
                    href={link.href}
                    className={`mobile-nav-link ${isActive(link.href, link.matchExact) ? "active" : ""}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: staggerDelays[3] }}
              >
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#contact" className="mobile-nav-link contact-cta" onClick={(e) => smoothScrollTo(e, "#contact")}>
                  <i className="fas fa-envelope" aria-hidden="true"></i> Contact
                </a>
              </motion.li>
            </ul>
          </nav>

          {/* Mobile Socials */}
          <div className="mobile-nav-socials">
            <a href="https://www.facebook.com/Nandailykc" className="social-icon-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com" className="social-icon-btn" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="https://instagram.com" className="social-icon-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
          </div>

          {/* Whatsapp CTA */}
          <a
            href="https://wa.me/8801771242424"
            className="mobile-whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp" aria-hidden="true"></i>
            WhatsApp করুন
          </a>
        </div>
      </MobileMenuWrapper>
    </>
  );
}
