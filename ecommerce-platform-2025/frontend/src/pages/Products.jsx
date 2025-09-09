// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import "./styles/products.css";
import { addItem } from "../services/cartService";
import { formatCurrency } from "../utils/format";
import { fetchProducts } from "../services/productService";
import "./styles/toast.css";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // const [flash, setFlash] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // hold refs to cards for reveal-on-scroll
  const cardRefs = useRef([]);

  // read filters from ?q=&min=&max=
  useEffect(() => {
    const q0 = searchParams.get("q") ?? "";
    const min0 = searchParams.get("min") ?? "";
    const max0 = searchParams.get("max") ?? "";
    setQ(q0);
    setMinPrice(min0);
    setMaxPrice(max0);
  }, [searchParams]);

  // simple debounce for q
  const qDebounced = useMemo(() => q, [q]);

  // load from backend
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({
          q: qDebounced,
          minPrice,
          maxPrice,
        });
        if (!ignore) setProducts(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [qDebounced, minPrice, maxPrice]);

  function handleAdd(e, p) {
    // p already normalized by service: {id,name,price,image,...}
    addItem(p, 1);

    const btn = e?.currentTarget;
    if (btn) {
      btn.classList.remove("btn-pop");
      btn.offsetWidth; // reflow to restart animation
      btn.classList.add("btn-pop");
    }

    // push a new toast
    const id = toastId.current++;
    const newToast = { id, message: `Added “${p.name}” to cart` };
    setToasts((prev) => [...prev, newToast]);

    // Start exit at 1.6s, then remove after CSS exit duration (250ms)
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 260); // keep in sync with CSS --toast-exit-ms
    }, 1600);
  }

  // Reveal-on-scroll (staggered)
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [products.length]);

  return (
    <main className="container py-5 products-scope" data-nav-safe>
      <h1 className="h4 fw-bold mb-4">Products</h1>

      {/* Filters */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light border-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </span>
            <input
              type="search"
              className="form-control form-control-lg border-0 bg-light"
              placeholder="Search for products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-medium">Min Price</label>
              <input
                type="number"
                inputMode="decimal"
                className="form-control form-control-lg"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">Max Price</label>
              <input
                type="number"
                inputMode="decimal"
                className="form-control form-control-lg"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <div id="toast-root" className="toast-container">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flash-message toast-success${
                t.leaving ? " leaving" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              <span className="toast-icon" aria-hidden="true">
                ✓
              </span>
              <span className="toast-text">{t.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
      {loading && <div className="text-muted mb-3">Loading products…</div>}

      {/* Grid */}
      <div className="row g-4">
        {products.map((p, i) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <article
              ref={(el) => (cardRefs.current[i] = el)}
              className="card product-card h-100 border-0 shadow-sm reveal-up"
              style={{ "--stagger": `${i % 9}` }}
            >
              <div
                className="product-image"
                style={{ backgroundImage: `url(${p.image})` }}
                role="img"
                aria-label={p.name}
              />
              <div className="card-body">
                <h3 className="h6 product-title mb-1">{p.name}</h3>
                <p className="text-muted mb-3">{formatCurrency(p.price)}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-dark flex-fill"
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-dark flex-fill"
                    onClick={(e) => handleAdd(e, p)}
                    data-nav-ignore
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <div className="col-12">
            <div className="text-center text-muted py-5">
              No products match your filters.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
