// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/products.css";
import { mockProducts } from "../data/mockProducts";
import { addItem } from "../services/cartService";
import { formatCurrency } from "../utils/format";

export default function Products() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [flash, setFlash] = useState("");

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

  function handleAdd(p) {
    addItem(p, 1);
    setFlash(`Added “${p.name}” to cart`);
    window.setTimeout(() => setFlash(""), 1600);
  }

  return (
    <main className="container py-5 products-scope" data-nav-safe>
      <h1 className="h4 fw-bold mb-4">Products</h1>

      {/* Top search row (desktop header in your sample) */}
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

        {/* Price filters */}
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

      {/* Product grid: 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <article className="card product-card h-100 border-0 shadow-sm">
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
                    onClick={() => handleAdd(p)}
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
