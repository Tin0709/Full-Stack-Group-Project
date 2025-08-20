// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useCartCount from "../hooks/useCartCount";
import { clearUser } from "../redux/slices/userSlice";
import { logout } from "../services/authService";

import logo from "../assets/logo.jpeg";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);
  const count = useCartCount();

  // Shrink on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cart badge bump
  const [bump, setBump] = useState(false);
  const prevRef = useRef(count);
  useEffect(() => {
    if (count > prevRef.current) {
      setBump(false);
      requestAnimationFrame(() => setBump(true));
      const t = setTimeout(() => setBump(false), 220);
      return () => clearTimeout(t);
    }
    prevRef.current = count;
  }, [count]);

  // Collapse behaviour on mobile
  const togglerRef = useRef(null);
  const closeNavIfOpen = () => {
    const nav = document.getElementById("topNav");
    if (nav && nav.classList.contains("show") && togglerRef.current) {
      togglerRef.current.click(); // toggles Bootstrap collapse
    }
  };

  // Logout
  const onLogout = async () => {
    try {
      await logout();
    } finally {
      dispatch(clearUser());
      navigate("/", { replace: true });
      closeNavIfOpen();
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fancy-nav sticky-top ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={closeNavIfOpen}
        >
          <img src={logo} alt="SwiftShip logo" className="logo-img" />
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNav"
          aria-controls="topNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={togglerRef}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="topNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className="nav-link fancy-link"
                to="/products"
                onClick={closeNavIfOpen}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link fancy-link"
                to="/about"
                onClick={closeNavIfOpen}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link fancy-link"
                to="/privacy"
                onClick={closeNavIfOpen}
              >
                Privacy
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link fancy-link"
                to="/help"
                onClick={closeNavIfOpen}
              >
                Help
              </NavLink>
            </li>
          </ul>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Cart */}
            <Link
              className="btn btn-ghost-icon position-relative cart-btn fancy-press"
              to="/cart"
              aria-label="Open cart"
              onClick={closeNavIfOpen}
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

            {/* Auth area */}
            {!user ? (
              <>
                <Link
                  className="btn btn-ghost fancy-press"
                  to="/login"
                  onClick={closeNavIfOpen}
                >
                  Login
                </Link>
                <Link
                  className="btn btn-solid fancy-press btn-shine"
                  to="/register"
                  onClick={closeNavIfOpen}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-ghost fancy-press"
                  to="/role"
                  onClick={closeNavIfOpen}
                >
                  Dashboard
                </Link>
                <Link
                  className="btn btn-ghost fancy-press"
                  to="/account"
                  onClick={closeNavIfOpen}
                >
                  My Account
                </Link>
                <button
                  className="btn btn-outline-secondary fancy-press"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
