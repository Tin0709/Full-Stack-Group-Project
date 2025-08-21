// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

import FormField from "../components/ui/FormField";
import UploadBox from "../components/ui/UploadBox";
import PrimaryButton from "../components/ui/PrimaryButton";

const NAME_MAX = 60;
const DESC_MAX = 500;

export default function VendorAddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // validators for FormField
  const validName = (v = "") =>
    v.trim().length > 0 && v.trim().length <= NAME_MAX;
  const validPrice = (v = "") => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const canSubmit =
    validName(name) &&
    validPrice(price) &&
    desc.length <= DESC_MAX &&
    !!file &&
    !busy;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setBusy(true);
      setError("");

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("price", price);
      fd.append("description", desc.trim());
      // IMPORTANT: match your backend field name here
      // If your API expects "imageUrl" or "photo", change "image" accordingly.
      fd.append("image", file);

      try {
        await api.post("/api/vendor/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        // fallback if you only have a generic route
        await api.post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/vendor/products", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Could not add product. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container py-5" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 fw-bold mb-3">Add New Product</h1>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <FormField
                  label="Product Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                  placeholder="Enter product name"
                  validator={validName}
                  invalidMsg={`Please enter 1–${NAME_MAX} characters.`}
                  helperText={`${name.trim().length}/${NAME_MAX}`}
                />

                {/* Price */}
                <FormField
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  validator={validPrice}
                  invalidMsg="Please enter a price greater than 0."
                />

                {/* Image uploader (drag & drop + click) */}
                <div className="mb-3">
                  <UploadBox
                    file={file}
                    onFile={(f) => setFile(f)}
                    label="Product Image"
                    // hint shows under the box
                    hint="Drag & drop or click to upload"
                    // Accept only images
                    accept="image/*"
                    // Max ~2MB (adjust as needed; shows inline error if exceeded)
                    maxSize={2 * 1024 * 1024}
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Description</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    placeholder="Enter product description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value.slice(0, DESC_MAX))}
                  />
                  <div className="form-text text-end">
                    {desc.length}/{DESC_MAX}
                  </div>
                </div>

                <PrimaryButton loading={busy} disabled={!canSubmit}>
                  Add Product
                </PrimaryButton>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
