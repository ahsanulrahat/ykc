"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-header ${isSticky ? "sticky" : ""}`} role="banner">
      <div className="container header-container">
        <Link 
          href="/" 
          className="logo-link" 
          onClick={closeMenu}
          aria-label="Yaser Khan Chowdhury - Home"
        >
          <img src="/assets/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Yaser Khan Chowdhury</span>
        </Link>

        <nav 
          id="main-nav-menu"
          className={`nav-wrapper ${isMenuOpen ? "active" : ""}`}
          role="navigation"
          aria-label="Main Navigation"
        >
          <ul className="nav-menu">
            <li>
              <Link 
                href="/" 
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/vision-2030" 
                className={`nav-link ${pathname === "/vision-2030" ? "active" : ""}`}
                onClick={closeMenu}
              >
                Vision 2030
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className={`nav-link ${pathname.startsWith("/blog") ? "active" : ""}`}
                onClick={closeMenu}
              >
                Blog
              </Link>
            </li>
            <li>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a 
                href="/#contact" 
                className="nav-link contact-cta"
                onClick={closeMenu}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Header Controls (Theme Switcher, Mobile Toggle, Social Icons) */}
        <div className="header-controls">
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

          <button 
            className={`mobile-toggle ${isMenuOpen ? "active" : ""}`} 
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="main-nav-menu"
            aria-label={isMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="social-icons-desktop">
            <a 
              href="https://www.facebook.com/search/top?q=%E0%A6%87%E0%A7%9F%E0%A6%BE%E0%A6%B8%E0%A7%87%E0%A6%B0%20%E0%A6%96%E0%A6%BE%E0%A6%A8%20%E0%A6%9A%E0%A7%8C%E0%A6%A7%E0%A7%81%E0%A6%B0%E0%A7%80" 
              className="social-icon-btn" 
              aria-label="Facebook Page" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="#" className="social-icon-btn" aria-label="Twitter Profile"><i className="fab fa-twitter" aria-hidden="true"></i></a>
            <a href="#" className="social-icon-btn" aria-label="Instagram Profile"><i className="fab fa-instagram" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
    </header>
  );
}
