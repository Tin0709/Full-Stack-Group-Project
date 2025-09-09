// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

export default function RegisterChooseRole() {
  const navigate = useNavigate();

  // ------- page enter + scroll reveal -------
  const [mounted, setMounted] = useState(false);

  // soft pop when the page first mounts
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // reveal-on-scroll for role cards
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    document
      .querySelectorAll(".reg-scope .reveal")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const roles = [
    {
      id: "customer",
      title: "Customer",
      desc: "Shop for products",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmgiPCgYN-n5iUvjnrAKexJU3M7WQ0AXY9DuebmlE0bhxta7xnmhPzxhMqdA8CDQqnIHR8N_Otd58UB9DtPVqnw68IpTnC6PhsItwJYg2Ka5n89xLHC2v9bo4wkvzhb4WB40iTZzfQ1LX_FEqXVS2G7ALGwdBxhgvVUDu-kui6fEpx8CtJYLAFNSjpHGrYpR4I83OWSYZFKpIfTv477k2ivojx1dJ9WQAhfmbAICmw1EKn8HX9eD5J6hDxoxODZMg8rl4AO7dkxaM",
    },
    {
      id: "vendor",
      title: "Vendor",
      desc: "Sell your products",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEKr7iMHZ35zbcYNhKgy8azRDwP4nF-Lllb_XhO-1p0H5-YUqWyu52xe3KWsNoxDtbSHq7_TCcuQRsKojdOjJs5AFvKySrW0WeajWQ3-wic4xCT7OQveL4-YZKIjHTA21379KN9Q51OdWX9vDjZuQzTkQkgYiRohSEavHgYqNXExAJJd1Ki9QqWMqq9RXOOxyLgukYNC2BKI6u3XW2R-7gYmJzOybXSxPwqco6H_LASV3lpbi9EmiFngeWqrqSzWL23MrHr7QSZA8",
    },
    {
      id: "shipper",
      title: "Shipper",
      desc: "Deliver products",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuALtJ6tIC728zmEc_UfM95Zr2s2L4PPGJ5UW-eTnRS7Bk3u6oxXeoG6Sr4nvK6f9S87i-o63oVkL6sig-yXvnr5xnpi9C-EwQgWmdZBUnP6uSYX_NU_Z77H6PuAICFUrS_ykboZkNpweHMh0SHEGltDpFeD_KGqE_qn7DRlNle8NPIBBwFZqLgb-GnBVU4dgq_uj_6DdOEQSWOTxweNgOn5mEbnDnLO2ikaW8PWWK5QXlgBv9dBWmlszvubqihwYfjwpnVeUoIShmc",
    },
  ];

  return (
    <main
      className={`container py-5 reg-scope pop-page ${mounted ? "in" : ""}`}
    >
      <h2
        className="text-center fw-bold mb-4 reveal"
        style={{ "--stagger": 0 }}
      >
        Choose your role
      </h2>

      <div className="row g-4 justify-content-center">
        {roles.map((role, i) => (
          <div
            key={role.id}
            className="col-12 col-sm-6 col-md-4 reveal"
            style={{ "--stagger": i + 1 }}
          >
            <div
              className="role-card card h-100 border-0 shadow-sm"
              onClick={() => navigate(`/register/${role.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                navigate(`/register/${role.id}`)
              }
            >
              <div
                className="role-image"
                style={{ backgroundImage: `url(${role.img})` }}
                aria-hidden="true"
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">{role.title}</h5>
                <p className="card-text text-muted small mb-0">{role.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
