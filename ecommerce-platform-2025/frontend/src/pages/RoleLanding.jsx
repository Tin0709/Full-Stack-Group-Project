import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./styles/role-landing.css";

const IMG_SHOP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaCgrBo6qAM4jxr0GV5TVS-EF91zCGdoD008__FRUkT9xcjWSID_Hh-7xAlxmZEXi-Nil-P09nIszrxD8zbokYYKXuPq_TUjDGjzYNQYsfYM_x7tBs860mRaXYwEfyA_g5dsJnVg-7wdpCFB3vmQ2UmSt8VYZh0fNdnu6v2uJte9YutkhPbXjlYPdG5wpsoP19QEXE9E_cwtTbkecY0qumMdp_2QCensHj-eI4IunMpj7MbXdtlt2cg8ZpNCzzO3VmFiKvj4jZTy4";
const IMG_SELL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfUvVFEuMIA8qzIRSgfbBnY74vYTrMOwHCoGEQhtyZWxj5HNaX_5FBaLQtKImUBDqbFZRajzoMERTHVV3spHBzUig5_Tg_Q5r_4bVQ4WqxoM5CBL3ZJpvGYGznrxViTASEzN_7sBn4MlrQlI8Qb8kQofG23HOmXfTRObh5qM6CsblNAW2olc0SrcxmLiTNzuBcXOryGkLirFW2PvfU-AMARfdLQKcncunsIUdadVMlhhklkMWzPYLMfnAZkl7qg7aUbYfgb5RCsEw";
const IMG_SHIP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBipVz8TFKuFah1l4lHNVPAL6Vpg8cBTsKEnXpCzRqZrkT2oZskxsQA7KEEIrCTP52A6-X2L8wJuGGQ_Wz_vQFdLzRFeE36b1gOaaPDU3xLkLJRo6Kb70qCmPXbCpiZsasR5Aj6yNQVVeZnWzvXFL2MatiMdWZGKdZDtNylzkPv7mTPr2VapnLAacMbzYbPn9SGIPYI9qYFtCOFvEWxKO559GOpD1ty7kCmHMtRhWsW1CZC9AEl1Ydu86EfpNpPkCV78HQLFlcJPUo";
const IMG_CART =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaCgrBo6qAM4jxr0GV5TVS-EF91zCGdoD008__FRUkT9xcjWSID_Hh-7xAlxmZEXi-Nil-P09nIszrxD8zbokYYKXuPq_TUjDGjzYNQYsfYM_x7tBs860mRaXYwEfyA_g5dsJnVg-7wdpCFB3vmQ2UmSt8VYZh0fNdnu6v2uJte9YutkhPbXjlYPdG5wpsoP19QEXE9E_cwtTbkecY0qumMdp_2QCensHj-eI4IunMpj7MbXdtlt2cg8ZpNCzzO3VmFiKvj4jZTy4";

const roleLabel = (r) => (r ? r[0].toUpperCase() + r.slice(1) : "");

export default function RoleLanding() {
  const user = useSelector((s) => s.user.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    document
      .querySelectorAll(".role-landing .reveal")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!user) return null;

  const name = user.username;
  const actionsByRole = {
    customer: [
      { to: "/products", title: "Browse Products", img: IMG_SELL },
      { to: "/cart", title: "View Cart", img: IMG_CART },
    ],
    vendor: [
      { to: "/vendor/products", title: "View My Products", img: IMG_SELL },
      { to: "/vendor/products/new", title: "Add New Product", img: IMG_SHOP },
    ],
    shipper: [{ to: "/shipper/orders", title: "Orders List", img: IMG_SHIP }],
  };
  const actions = actionsByRole[user.role] || [];

  return (
    <main
      className={`container py-5 role-landing ${
        mounted ? "rl-in" : "rl-enter"
      }`}
      data-nav-skip
      data-nav-safe
    >
      <h1
        className="text-center fw-bold mb-1 reveal"
        style={{ "--stagger": 0 }}
      >
        Welcome back, {name}!
      </h1>
      <p
        className="text-center text-muted mb-4 reveal"
        style={{ "--stagger": 0.2 }}
      >
        {roleLabel(user.role)}
      </p>

      <div className="row g-3 justify-content-center">
        {actions.map((a, idx) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 reveal"
            style={{ "--stagger": idx }}
            key={idx}
          >
            <Link
              to={a.to}
              className="card text-decoration-none tile h-100"
              aria-label={a.title}
            >
              <div
                className="ratio ratio-1x1 tile-img"
                style={{ backgroundImage: `url(${a.img})` }}
              />
              <div className="card-body py-3">
                <p className="card-title text-center fw-semibold mb-0">
                  {a.title}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
