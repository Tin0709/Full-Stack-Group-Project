// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../services/api";
import "./styles/vendor-products.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const toAbsolute = (u) => {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return u;
};

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/679/679922.png"; // simple box icon

export default function VendorViewProducts() {
  const authUser = useSelector((s) => s.user.user);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  const isVendor = authUser?.role === "vendor";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Try a vendor-specific endpoint first; fall back to a generic one.
        let data;
        try {
          ({ data } = await api.get("/api/vendor/products"));
        } catch (err) {
          ({ data } = await api.get("/api/products/mine"));
        }
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "Could not load your products. Please try again.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [q, items]);

  async function handleDelete(id) {
    if (!id) return;
    const confirm = window.confirm(
      "Delete this product? This cannot be undone."
    );
    if (!confirm) return;

    try {
      setDeleting(id);
      setError("");
      try {
        await api.delete(`/api/vendor/products/${id}`);
      } catch {
        await api.delete(`/api/products/${id}`);
      }
      setItems((old) => old.filter((p) => String(p._id) !== String(id)));
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to delete. Please try again.";
      setError(msg);
    } finally {
      setDeleting("");
    }
  }

  return (
    <main
      className="container py-4 vendor-products"
      data-nav-skip
      data-nav-safe
    >
      {/* Header row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">My Products</h1>

        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          {/* was: btn btn-primary */}
          <Link className="btn btn-add-soft" to="/vendor/products/new">
            Add New Product
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Card + table */}
      <section className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5 d-flex justify-content-center">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-muted">
              {q
                ? "No products match your search."
                : "You have no products yet."}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-white">
                  <tr>
                    <th style={{ width: 64 }}>Product</th>
                    <th>Name</th>
                    <th style={{ width: 140 }}>Price</th>
                    <th>Description</th>
                    <th style={{ width: 160 }} className="text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p._id} className="border-top">
                      <td>
                        <img
                          src={toAbsolute(p.imageUrl) || PLACEHOLDER}
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                          alt={p.name || "Product"}
                          className="rounded-circle"
                          width={40}
                          height={40}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="text-body">{p.name || "—"}</td>
                      <td className="text-muted">
                        {p.price != null
                          ? `$${Number(p.price).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="text-muted">
                        {p.description ? (
                          <span className="text-wrap d-inline-block desc-clamp">
                            {p.description}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/vendor/products/${p._id}/edit`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p._id)}
                            disabled={!!deleting}
                          >
                            {deleting === String(p._id)
                              ? "Deleting…"
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Vendor-only hint (if someone lands here without role=vendor) */}
      {!isVendor && (
        <p className="small text-muted mt-2">
          Note: This page is intended for vendors.
        </p>
      )}
    </main>
  );
}
