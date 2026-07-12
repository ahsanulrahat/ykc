import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="container">
            {/* Footer quote / tagline */}
            <div className="footer-quote">
                <p className="footer-quote-text">
                    &quot;জনগণের সেবায় নিবেদিত, ন্যায়ের পথে অবিচল&quot;
                </p>
                <p className="footer-quote-attribution">— ইয়াসের খান চৌধুরী</p>
            </div>

            <div className="footer-top">
                <div className="footer-logo">
                    <Image src="/assets/logo.png" alt="Logo" className="footer-logo-img" width={40} height={40} style={{ height: "auto" }} />
                    <span className="footer-logo-text">Yaser Khan Chowdhury</span>
                </div>
                <ul className="footer-menu">
                    <li><Link href="/" className="footer-menu-link">Home</Link></li>
                    <li><Link href="/vision-2030" className="footer-menu-link">Vision 2030</Link></li>
                    <li><Link href="/blog" className="footer-menu-link">Blog</Link></li>
                    <li>
                      <Link href="/#contact" className="footer-menu-link">Contact</Link>
                    </li>
                </ul>
                <div className="footer-socials">
                    <a href="https://www.facebook.com/Nandailykc" className="footer-social-btn" aria-label="Facebook Page" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" className="footer-social-btn" aria-label="Twitter Profile" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    <a href="https://instagram.com" className="footer-social-btn" aria-label="Instagram Profile" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright &copy; 2026 Yaser Khan Chowdhury | Powered by <a href="https://jvtron.com/" target="_blank" rel="noopener noreferrer">JVtron</a></p>
            </div>
        </div>
    </footer>
  );
}
