import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/products.css";
import { mockProducts } from "../data/mockProducts";
import { addItem } from "../services/cartService";
import { formatCurrency } from "../utils/format";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [flash, setFlash] = useState("");

  // hold refs to cards for reveal-on-scroll
  const cardRefs = useRef([]);

  useEffect(() => {
    const q0 = searchParams.get("q") ?? "";
    const min0 = searchParams.get("min") ?? "";
    const max0 = searchParams.get("max") ?? "";
    setQ(q0);
    setMinPrice(min0);
    setMaxPrice(max0);
  }, [searchParams]);

  const products = useMemo(() => {
    const term = q.trim().toLowerCase();
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    return mockProducts.filter((p) => {
      const nameOk = !term || p.name.toLowerCase().includes(term);
      const priceOk = p.price >= min && p.price <= max;
      return nameOk && priceOk;
    });
  }, [q, minPrice, maxPrice]);

  function handleAdd(e, p) {
    addItem(p, 1);
    // tiny pop feedback on the button
    const btn = e?.currentTarget;
    if (btn) {
      btn.classList.remove("btn-pop");
      // force reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      btn.offsetWidth;
      btn.classList.add("btn-pop");
    }
    setFlash(`Added “${p.name}” to cart`);
    window.setTimeout(() => setFlash(""), 1600);
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

      {flash && (
        <div className="alert alert-success py-2" role="alert">
          {flash}
        </div>
      )}

      {/* Grid */}
      <div className="row g-4">
        {products.map((p, i) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <article
              ref={(el) => (cardRefs.current[i] = el)}
              className="card product-card h-100 border-0 shadow-sm reveal-up"
              style={{ "--stagger": `${i % 9}` }} // small cyclic stagger
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
        {products.length === 0 && (
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
