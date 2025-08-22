import React, { useEffect, useRef, useState } from "react";
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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [bump, setBump] = useState(false);
  const prevRef = useRef(count);
  useEffect(() => {
    if (count > prevRef.current) {
      setBump(false);
      requestAnimationFrame(() => setBump(true));
      setTimeout(() => setBump(false), 220);
    }
    prevRef.current = count;
  }, [count]);

  return (
    <nav
      className={`navbar navbar-expand-lg fancy-nav sticky-top ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="container">
        <Link className="navbar-brand fancy-brand fw-bold" to="/">
          GenZ Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNav"
          aria-controls="topNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="topNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link fancy-link" to="/products">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fancy-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fancy-link" to="/privacy">
                Privacy
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fancy-link" to="/help">
                Help
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
                Vendor
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2" aria-labelledby="vendorMenu" style={{ minWidth: 260 }}>
                <li className="dropdown-header text-uppercase small text-muted">Overview</li>
                <li><NavLink end className="dropdown-item d-flex justify-content-between" to="/vendor">
                  <span>Dashboard</span>
                </NavLink></li>

                <li><hr className="dropdown-divider" /></li>

                <li className="dropdown-header text-uppercase small text-muted">Catalog</li>
                <li><NavLink className="dropdown-item d-flex justify-content-between" to="/vendor/products"><span>Products</span></NavLink></li>
                <li><NavLink className="dropdown-item d-flex justify-content-between" to="/vendor/products/import"><span>Bulk Import</span></NavLink></li>

                <li className="dropdown-header text-uppercase small text-muted mt-2">Orders &amp; Inventory</li>
                <li><NavLink className="dropdown-item d-flex justify-content-between" to="/vendor/orders">
                  <span>Orders</span>
                  {/* pending badge here if you compute count in this component */}
                  {/* <span className="badge rounded-pill bg-secondary">3</span> */}
                </NavLink></li>
                <li><NavLink className="dropdown-item d-flex justify-content-between" to="/vendor/inventory">
                  <span>Inventory</span>
                  {/* <span className="badge rounded-pill bg-secondary">2</span> */}
                </NavLink></li>

                <li className="dropdown-header text-uppercase small text-muted mt-2">Marketing</li>
                <li><NavLink className="dropdown-item" to="/vendor/categories">Categories</NavLink></li>
                <li><NavLink className="dropdown-item" to="/vendor/coupons">Coupons</NavLink></li>

                <li><hr className="dropdown-divider" /></li>

                <li><NavLink className="dropdown-item" to="/vendor/settings">Settings</NavLink></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Cart */}
            <Link
              className="btn btn-ghost-icon position-relative cart-btn fancy-press"
              to="/cart"
              aria-label="Open cart"
            >
              <CartIcon />
              {count > 0 && (
                <span
                  className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark cart-badge ${
                    bump ? "badge-bump" : ""
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>

            {/* Auth */}
            <Link className="btn btn-ghost fancy-press" to="/login">
              Login
            </Link>
            <Link
              className="btn btn-solid fancy-press btn-shine"
              to="/register"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
