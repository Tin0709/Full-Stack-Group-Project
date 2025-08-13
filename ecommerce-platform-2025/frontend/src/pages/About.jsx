// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Nguyen Trun Tin
// ID: s3988418

import React, { useState } from "react";
import "./styles/about.css";

/* ---- Inline icons for Key Features ---- */
function getIcon(name) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <path d="M4 20a7 7 0 0 1 16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4 7h16l-1 5H5L4 7Z" />
          <path d="M5 12v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
          <path d="M8 12v7" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M1 16h13V6H1z" />
          <path d="M14 8h4l3 4v4h-3" />
          <circle cx="5.5" cy="18.5" r="1.5" />
          <circle cx="16.5" cy="18.5" r="1.5" />
        </svg>
      );
    case "card":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V5l7-3Z" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0 1 16 0" />
          <rect x="2" y="12" width="4" height="6" rx="1" />
          <rect x="18" y="12" width="4" height="6" rx="1" />
          <path d="M8 20h8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---- Team auto-detect: shows avatar only if /public/team/<slug>.jpg exists ---- */
const TEAM_SLUGS = ["tin", "mai", "vuong", "dat", "ryota"];
const TEAM_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function MemberAvatar({ slug }) {
  const [exists, setExists] = useState(true);
  const [src, setSrc] = useState(`/team/${slug}.${TEAM_EXTENSIONS[0]}`);

  const name = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  function tryNextExtension(currentExt) {
    const currentIndex = TEAM_EXTENSIONS.indexOf(currentExt);
    const nextIndex = currentIndex + 1;
    if (nextIndex < TEAM_EXTENSIONS.length) {
      setSrc(`/team/${slug}.${TEAM_EXTENSIONS[nextIndex]}`);
    } else {
      setExists(false);
    }
  }

  if (!exists) return null;

  return (
    <div className="col-6 col-sm-4 col-lg-2">
      <div className="team-card text-center">
        <div className="team-avatar-wrap mx-auto">
          <img
            className="team-avatar-img"
            src={src}
            alt={name}
            onError={() => {
              const ext = src.split(".").pop().toLowerCase();
              tryNextExtension(ext);
            }}
          />
        </div>
        <div className="mt-2 fw-semibold small">{name}</div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero text-center text-white d-flex align-items-center">
        <div className="container position-relative">
          <h1 className="display-5 fw-bold mb-3">
            Connecting Buyers, Sellers, and Shippers Seamlessly
          </h1>
          <p className="lead mx-auto mb-4 about-hero-text">
            SwiftShip is a multi‑role e‑commerce platform designed to streamline
            the online shopping experience for customers, vendors, and shippers.
            Our platform offers a comprehensive suite of tools and features to
            facilitate smooth transactions, efficient logistics, and enhanced
            user engagement.
          </p>
          <button className="btn btn-danger btn-lg px-4">
            Explore Platform
          </button>
        </div>
        <div className="about-hero__overlay" aria-hidden="true" />
      </section>

      {/* Our Growth Story */}
      <section className="py-5">
        <div className="container">
          <h2 className="h3 fw-bold mb-4">Our Growth Story</h2>
          <div className="timeline">
            {[
              {
                title: "Platform Launch",
                desc: "Launched the SwiftShip platform with core e‑commerce functionalities.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 10h16" />
                  </svg>
                ),
              },
              {
                title: "Vendor Onboarding",
                desc: "Successfully onboarded over 500 vendors, expanding product offerings.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 4h18l-2 6H5L3 4z" />
                    <path d="M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
                  </svg>
                ),
              },
              {
                title: "Shipping Integration",
                desc: "Integrated with major shipping providers for seamless logistics.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 16h13V6H1z" />
                    <path d="M14 8h4l3 4v4h-3" />
                    <circle cx="5.5" cy="18.5" r="1.5" />
                    <circle cx="16.5" cy="18.5" r="1.5" />
                  </svg>
                ),
              },
              {
                title: "User Expansion",
                desc: "Reached 100,000 registered users, driving significant transaction growth.",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M4 20a7 7 0 0 1 16 0" />
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div className="timeline-item" key={title}>
                <div className="timeline-icon">{icon}</div>
                <div>
                  <p className="fw-bold mb-1">{title}</p>
                  <p className="text-muted mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="h3 fw-bold mb-4">Key Features</h2>
          <div className="feature-grid">
            {[
              {
                title: "Customer Accounts",
                desc: "Personalized shopping experience with order tracking and history.",
                icon: "user",
              },
              {
                title: "Vendor Management",
                desc: "Tools for managing products, orders, and customer interactions.",
                icon: "store",
              },
              {
                title: "Shipping Solutions",
                desc: "Integrated shipping options with real‑time tracking and delivery updates.",
                icon: "truck",
              },
              {
                title: "Secure Payments",
                desc: "Secure payment gateways ensuring safe and reliable transactions.",
                icon: "card",
              },
              {
                title: "Trust & Safety",
                desc: "Robust policies and measures to protect users and ensure fair practices.",
                icon: "shield",
              },
              {
                title: "Customer Support",
                desc: "Dedicated support team to assist with inquiries and resolve issues.",
                icon: "headset",
              },
            ].map(({ title, desc, icon }) => (
              <article className="kf-card" key={title}>
                <div className="kf-icon">{getIcon(icon)}</div>
                <h3 className="kf-title">{title}</h3>
                <p className="kf-desc mb-0">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team (auto-detect images in /public/team) */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="h3 fw-bold mb-3">Meet the Team</h2>
          <div className="row g-4 justify-content-center">
            {TEAM_SLUGS.map((slug) => (
              <MemberAvatar key={slug} slug={slug} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 cta-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Join SwiftShip Today</h2>
          <button className="btn btn-danger btn-lg px-4">Get Started</button>
        </div>
      </section>
    </main>
  );
}
