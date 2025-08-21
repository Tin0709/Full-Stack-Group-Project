import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-auto">
      <div className="container py-4 py-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        {/* Left: brand & copyright */}
        <div className="text-muted small order-2 order-md-1 text-center text-md-start">
          <div className="fw-semibold text-dark">Genz Shop</div>
          <div className="opacity-75">
            © {year} Genz Shop — All rights reserved
          </div>
        </div>

        {/* Middle: quick links */}
        <nav
          className="footer-nav d-flex gap-3 gap-md-4 order-1 order-md-2"
          aria-label="Footer navigation"
        >
          <Link className="footer-link" to="/about">
            About
          </Link>
          <Link className="footer-link" to="/privacy">
            Privacy
          </Link>
          <Link className="footer-link" to="/help">
            Help
          </Link>
        </nav>

        {/* Right: back to top */}
        <button
          type="button"
          className="btn btn-sm btn-outline-dark rounded-pill px-3 order-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
