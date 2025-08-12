import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-top py-3">
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        <span className="text-muted">
          © {new Date().getFullYear()} MultiRole Shop
        </span>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link px-2 text-muted" to="/about">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-2 text-muted" to="/privacy">
              Privacy
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-2 text-muted" to="/help">
              Help
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
