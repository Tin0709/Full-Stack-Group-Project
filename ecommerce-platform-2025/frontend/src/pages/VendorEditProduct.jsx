// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import "./styles/vendor-add-product.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/679/679922.png";

const toAbsolute = (u) => {
  if (!u) return "";
  if (u.startsWith("data:")) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return `${API_BASE}/${u.replace(/^\.?\//, "")}`;
};

export default function VendorEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/api/vendor/products/${id}`);
        if (!mounted) return;
        setName(data.name || "");
        setPrice(typeof data.price === "number" ? String(data.price) : "");
        setDescription(data.description || "");
        const raw = data.imageUrl || data.image || "";
        setImageUrl(toAbsolute(raw));
      } catch (e) {
        setError(e?.response?.data?.message || "Could not load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  function handlePick() {
    fileRef.current?.click();
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(f);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const p = Number(price);
    if (!name.trim()) return setError("Name is required.");
    if (isNaN(p) || p <= 0) return setError("Price must be a positive number.");
    if (description.length > 500)
      return setError("Description must be <= 500 characters.");

    try {
      setSaving(true);
      setError("");

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("price", p);
      fd.append("description", description);
      if (file) fd.append("image", file);

      await api.put(`/api/vendor/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/vendor/products", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container py-4 vendor-add-scope" data-nav-safe>
      <div className="mx-auto" style={{ maxWidth: 840 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 fw-bold mb-0">Edit Product</h1>
          <Link to="/vendor/products" className="btn btn-outline-secondary">
            Back to My Products
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Image preview + centered actions */}
              <div className="mb-4 text-center">
                <div
                  className="product-image-preview mx-auto"
                  style={{
                    backgroundImage: `url(${imageUrl || PLACEHOLDER})`,
                  }}
                  aria-label="Product image"
                />
                <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary image-action"
                    onClick={handlePick}
                  >
                    Change Image
                  </button>
                  {(imageUrl || file) && (
                    <button
                      type="button"
                      className="btn btn-outline-danger image-action"
                      onClick={() => {
                        setImageUrl("");
                        setFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                />
                <div className="form-text">{name.length}/100</div>
              </div>

              {/* Price */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="price">
                  Price (USD)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="desc">
                  Description
                </label>
                <textarea
                  id="desc"
                  className="form-control"
                  rows={6}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="form-text">{description.length}/500</div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/vendor/products")}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
