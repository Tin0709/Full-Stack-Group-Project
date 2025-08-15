import { Link, NavLink } from "react-router-dom";
import useCartCount from "../hooks/useCartCount";
import "./header.css";

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h2l2.1 10.3A3 3 0 0 0 10.05 16H18a1 1 0 1 0 0-2h-7.95a1 1 0 0 1-.98-.8L8 12h8.45a3 3 0 0 0 2.94-2.37l.93-4.2A1 1 0 0 0 19.36 4H6.24L5.8 2.2A1 1 0 0 0 4.83 2H3a1 1 0 1 0 0 2Z"
      />
    </svg>
  );
}

export default function Header() {
  const count = useCartCount();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          GenZ Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="topNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/privacy">
                Privacy
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/help">
                Help
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Cart button */}
            <Link
              className="btn btn-outline-secondary position-relative cart-btn"
              to="/cart"
              aria-label="Open cart"
            >
              <CartIcon />
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark cart-badge">
                  {count}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            <Link className="btn btn-outline-secondary" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
