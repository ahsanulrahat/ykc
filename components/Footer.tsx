import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="container">
            <div className="footer-top">
                <div className="footer-logo">
                    <img src="/assets/logo.png" alt="Logo" className="footer-logo-img" />
                    <span className="footer-logo-text">Yaser Khan Chowdhury</span>
                </div>
                <ul className="footer-menu">
                    <li><Link href="/" className="footer-menu-link">Home</Link></li>
                    <li><Link href="/vision-2030" className="footer-menu-link">Vision 2030</Link></li>
                    <li><Link href="/blog" className="footer-menu-link">Blog</Link></li>
                    <li>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/#contact" className="footer-menu-link">Contact</a>
                    </li>
                </ul>
                <div className="footer-socials">
                    <a href="https://www.facebook.com/search/top?q=%E0%A6%87%E0%A7%9F%E0%A6%BE%E0%A6%B8%E0%A7%87%E0%A6%B0%20%E0%A6%96%E0%A6%BE%E0%A6%A8%20%E0%A6%9A%E0%A7%8C%E0%A6%A7%E0%A7%81%E0%A6%B0%E0%A7%80" className="footer-social-btn" aria-label="Facebook Page" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="footer-social-btn"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="footer-social-btn"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright &copy; 2026 Yaser Khan Chowdhury | Powered by <a href="https://jvtron.com/" target="_blank" rel="noopener noreferrer">JVtron</a></p>
            </div>
        </div>
    </footer>
  );
}
