import React, { useEffect, useId, useRef, useState } from "react";
export default function ProductForm({
  initial = {},
  onSubmit,
  onCancel,
  submitText = "Save",
  title = "Product details",
}) {
  const uid = useId();
  const fileRef = useRef(null);
  const dropRef = useRef(null);

  const [values, setValues] = useState(() => ({
    name: initial.name || "",
    price: initial.price ?? "",
    description: initial.description || "",
    stock: initial.stock ?? "",
    category: initial.category || "",
    image: initial.image || "",
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Live character limit for description
  const DESC_MAX = 600;

  useEffect(() => {
    const next = {
      name: initial.name || "",
      price: initial.price ?? "",
      description: initial.description || "",
      stock: initial.stock ?? "",
      category: initial.category || "",
      image: initial.image || "",
    };
    setValues((prev) => {
      const same =
        prev.name === next.name &&
        String(prev.price ?? "") === String(next.price ?? "") &&
        prev.description === next.description &&
        String(prev.stock ?? "") === String(next.stock ?? "") &&
        prev.category === next.category &&
        prev.image === next.image;
      return same ? prev : next;
    });
  }, [
    initial.name,
    initial.price,
    initial.description,
    initial.stock,
    initial.category,
    initial.image,
  ]);

  function validate(v) {
    const e = {};
    if (!v.name?.trim()) e.name = "Name is required";
    if (v.name?.length > 120) e.name = "Name must be ≤ 120 characters";

    if (v.price === "" || Number.isNaN(Number(v.price)) || Number(v.price) < 0) {
      e.price = "Price must be ≥ 0";
    }

    if (
      v.stock === "" ||
      Number.isNaN(Number(v.stock)) ||
      !Number.isFinite(Number(v.stock)) ||
      Number(v.stock) < 0 ||
      !Number.isInteger(Number(v.stock))
    ) {
      e.stock = "Stock must be an integer ≥ 0";
    }

    if (v.description?.length > DESC_MAX) {
      e.description = `Max ${DESC_MAX} characters`;
    }

    if (typeof v.image === "string" && v.image && !v.image.startsWith("data:image")) {
      // If provided externally but not a data URL, we still allow it—skip.
    }

    return e;
  }

  function handleChange(ev) {
    const { name, value } = ev.target;
    setValues((s) => ({ ...s, [name]: value }));
  }

  function handleNumberChange(ev) {
    const { name, value } = ev.target;
    // Allow empty string for controlled reset; otherwise keep numeric only
    if (value === "") return setValues((s) => ({ ...s, [name]: "" }));
    setValues((s) => ({ ...s, [name]: value }));
  }

  function markTouched(ev) {
    const { name } = ev.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleImageFile(file) {
    if (!file) return;
    const isImage = file.type?.startsWith("image/");
    const MAX_MB = 3;
    if (!isImage) {
      return setErrors((e) => ({ ...e, image: "Please choose an image file" }));
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return setErrors((e) => ({ ...e, image: `Image must be ≤ ${MAX_MB}MB` }));
    }
    const b64 = await toBase64(file);
    setValues((s) => ({ ...s, image: b64 }));
    setErrors((e) => ({ ...e, image: undefined }));
  }

  async function handleImage(ev) {
    const f = ev.target.files?.[0];
    if (!f) return;
    await handleImageFile(f);
  }

  function handlePaste(ev) {
    const item = Array.from(ev.clipboardData?.items || []).find((i) => i.type.startsWith("image/"));
    if (item) {
      const file = item.getAsFile();
      if (file) handleImageFile(file);
    }
  }

  // Drag & drop image
  function handleDragOver(ev) {
    ev.preventDefault();
    dropRef.current?.classList.add("border-primary");
  }
  function handleDragLeave() {
    dropRef.current?.classList.remove("border-primary");
  }
  async function handleDrop(ev) {
    ev.preventDefault();
    dropRef.current?.classList.remove("border-primary");
    const f = ev.dataTransfer?.files?.[0];
    if (f) await handleImageFile(f);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const trimmed = { ...values, name: values.name.trim() };
    const e = validate(trimmed);
    setErrors(e);
    setTouched({ name: true, price: true, stock: true, description: true, category: true, image: true });
    if (Object.keys(e).length === 0) {
      onSubmit?.({
        ...trimmed,
        price: Number(trimmed.price),
        stock: Number(trimmed.stock),
      });
    }
  }

  function resetForm() {
    setValues({
      name: initial.name || "",
      price: initial.price ?? "",
      description: initial.description || "",
      stock: initial.stock ?? "",
      category: initial.category || "",
      image: initial.image || "",
    });
    setErrors({});
    setTouched({});
    if (fileRef.current) fileRef.current.value = "";
  }

  const priceHint = values.price !== "" && Number.isFinite(Number(values.price))
    ? formatVND(Number(values.price))
    : "";

  const descCount = values.description?.length || 0;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 pb-0">
        <h5 className="mb-0 fw-semibold">{title}</h5>
        <p className="text-muted small mb-0">Fields marked with * are required.</p>
      </div>
      <div className="card-body" onPaste={handlePaste}>
        <form onSubmit={handleSubmit} noValidate>
          {/* NAME */}
          <div className="mb-3">
            <label htmlFor={`${uid}-name`} className="form-label">Name *</label>
            <input
              id={`${uid}-name`}
              className={`form-control${touched.name && errors.name ? " is-invalid" : ""}`}
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={markTouched}
              placeholder="e.g., Vietnamese Iced Coffee"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={`${uid}-name-help ${uid}-name-error`}
              required
            />
            <div id={`${uid}-name-help`} className="form-text">Max 120 characters.</div>
            {touched.name && errors.name && (
              <div id={`${uid}-name-error`} className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* PRICE & STOCK */}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor={`${uid}-price`} className="form-label">Price (VND) *</label>
              <div className="input-group">
                <span className="input-group-text">₫</span>
                <input
                  id={`${uid}-price`}
                  type="number"
                  min="0"
                  step="1000"
                  inputMode="numeric"
                  className={`form-control${touched.price && errors.price ? " is-invalid" : ""}`}
                  name="price"
                  value={values.price}
                  onChange={handleNumberChange}
                  onBlur={markTouched}
                  aria-describedby={`${uid}-price-help ${uid}-price-error`}
                  required
                />
              </div>
              <div id={`${uid}-price-help`} className="form-text">
                {priceHint ? `≈ ${priceHint}` : "Use step of 1,000 for VND."}
              </div>
              {touched.price && errors.price && (
                <div id={`${uid}-price-error`} className="invalid-feedback d-block">{errors.price}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor={`${uid}-stock`} className="form-label">Stock *</label>
              <div className="input-group">
                <input
                  id={`${uid}-stock`}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  className={`form-control${touched.stock && errors.stock ? " is-invalid" : ""}`}
                  name="stock"
                  value={values.stock}
                  onChange={handleNumberChange}
                  onBlur={markTouched}
                  aria-describedby={`${uid}-stock-error`}
                  required
                />
                <span className="input-group-text">units</span>
              </div>
              {touched.stock && errors.stock && (
                <div id={`${uid}-stock-error`} className="invalid-feedback d-block">{errors.stock}</div>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-3 mt-3">
            <label htmlFor={`${uid}-category`} className="form-label">Category</label>
            <input
              id={`${uid}-category`}
              className="form-control"
              name="category"
              placeholder="e.g., Beverage"
              value={values.category}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label htmlFor={`${uid}-desc`} className="form-label">Description</label>
            <textarea
              id={`${uid}-desc`}
              rows={4}
              className={`form-control${touched.description && errors.description ? " is-invalid" : ""}`}
              name="description"
              value={values.description}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= DESC_MAX) setValues((s) => ({ ...s, description: val }));
              }}
              onBlur={markTouched}
              placeholder="Short description of the product..."
              aria-describedby={`${uid}-desc-count ${uid}-desc-error`}
            ></textarea>
            <div id={`${uid}-desc-count`} className="form-text">
              {descCount}/{DESC_MAX}
            </div>
            {touched.description && errors.description && (
              <div id={`${uid}-desc-error`} className="invalid-feedback d-block">{errors.description}</div>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mb-3">
            <label className="form-label">Image</label>
            <div
              ref={dropRef}
              className="border rounded-3 p-3 d-flex align-items-center justify-content-between gap-3 bg-light-subtle"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Choose file
                </button>
                <small className="text-muted">Drag & drop or paste an image (≤ 3MB)</small>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </div>
            {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}

            {values.image && (
              <div className="mt-3 d-flex align-items-start gap-3">
                <div className="ratio ratio-16x9" style={{ width: 260 }}>
                  <img
                    src={values.image}
                    alt="Preview"
                    className="rounded object-fit-cover"
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setValues((s) => ({ ...s, image: "" }))}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="d-flex align-items-center gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-4">
              {submitText}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
              Reset
            </button>
            {onCancel && (
              <button type="button" className="btn btn-link text-decoration-none" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function formatVND(n) {
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n} ₫`;
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
