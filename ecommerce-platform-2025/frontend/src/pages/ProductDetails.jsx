// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/product-details.css";
import { addItem } from "../services/cartService";
import { formatCurrency } from "../utils/format";
import { fetchProductById } from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const p = await fetchProductById(id);
        if (!ignore) setProduct(p);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="container py-5" data-nav-safe>
        <div className="text-muted">Loading product…</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-5" data-nav-safe>
        <div className="text-center py-5">
          <h1 className="h4 fw-bold mb-2">Product not found</h1>
          <p className="text-muted mb-4">
            We couldn’t find what you’re looking for.
          </p>
          <button
            className="btn btn-dark"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const description =
    product.description ||
    `Discover ${product.name}. Carefully built for everyday use with reliable performance and modern design.`;

  function changeQty(delta) {
    setQty((n) => Math.min(99, Math.max(1, Number(n) + delta)));
  }

  function onQtyInput(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return setQty(1);
    setQty(Math.min(99, Math.max(1, n)));
  }

  function handleAdd(e) {
    // product is normalized by service: {id, name, price, image}
    addItem(product, qty);
    const btn = e?.currentTarget;
    if (btn) {
      btn.classList.remove("btn-pop");
      /// eslint-disable-next-line no-unused-expressions
      btn.offsetWidth;
      btn.classList.add("btn-pop");
    }
    setFlash(`Added ${qty} × “${product.name}” to cart`);
    window.setTimeout(() => setFlash(""), 1600);
  }

  return (
    <main className="container py-5 pd-scope" data-nav-safe>
      <div className="row g-4 align-items-start">
        {/* Image */}
        <div className="col-12 col-lg-6">
          <div
            className="pd-image shadow-sm"
            style={{ backgroundImage: `url(${product.image})` }}
            role="img"
            aria-label={product.name}
          />
        </div>

        {/* Details */}
        <div className="col-12 col-lg-6">
          <h1 className="h4 fw-bold mb-2">{product.name}</h1>
          <p className="text-muted mb-3">{formatCurrency(product.price)}</p>
          <p className="mb-4">{description}</p>

          {/* Quantity + Add to Cart */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="input-group input-group-lg qty-group">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => changeQty(-1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => onQtyInput(e.target.value)}
                className="form-control text-center"
                aria-label="Quantity"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => changeQty(1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="btn btn-dark btn-lg flex-grow-1"
              onClick={handleAdd}
              data-nav-ignore
            >
              Add to Cart
            </button>
          </div>

          {flash && (
            <div className="alert alert-success py-2 mt-3" role="alert">
              {flash}
            </div>
          )}

          {/* Back link */}
          <div className="mt-4">
            <button
              className="btn btn-link text-decoration-underline"
              onClick={() => navigate("/products")}
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
