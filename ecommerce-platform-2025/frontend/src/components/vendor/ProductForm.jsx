
import React, { useEffect, useRef, useState } from "react";

// Reusable form for Add/Edit product.
// Props:
// - initial: {name, price, description, stock, category, image}
// - onSubmit: (values) => void
// - submitText: string
export default function ProductForm({ initial = {}, onSubmit, submitText="Save" }) {
  const [values, setValues] = useState({
    name: initial.name || "",
    price: initial.price ?? "",
    description: initial.description || "",
    stock: initial.stock ?? "",
    category: initial.category || "",
    image: initial.image || "",
  });
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    setValues({
      name: initial.name || "",
      price: initial.price ?? "",
      description: initial.description || "",
      stock: initial.stock ?? "",
      category: initial.category || "",
      image: initial.image || "",
    });
  }, [initial]);

  function validate(v) {
    const e = {};
    if (!v.name?.trim()) e.name = "Name is required";
    if (v.price === "" || Number(v.price) < 0) e.price = "Price must be ≥ 0";
    if (v.stock === "" || Number.isNaN(Number(v.stock)) || Number(v.stock) < 0)
      e.stock = "Stock must be ≥ 0";
    return e;
  }

  function handleChange(ev) {
    const { name, value } = ev.target;
    setValues((s) => ({ ...s, [name]: value }));
  }

  async function handleImage(ev) {
    const f = ev.target.files?.[0];
    if (!f) return;
    // Convert to base64 for demo storage
    const b64 = await toBase64(f);
    setValues((s) => ({ ...s, image: b64 }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      onSubmit?.({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      });
    }
  }

  return (
    <form className="mt-3" onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Name *</label>
        <input
          className={"form-control" + (errors.name ? " is-invalid" : "")}
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g., Vietnamese Iced Coffee"
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Price (VND) *</label>
          <input
            type="number"
            min="0"
            className={"form-control" + (errors.price ? " is-invalid" : "")}
            name="price"
            value={values.price}
            onChange={handleChange}
            required
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">Stock *</label>
          <input
            type="number"
            min="0"
            className={"form-control" + (errors.stock ? " is-invalid" : "")}
            name="stock"
            value={values.stock}
            onChange={handleChange}
            required
          />
          {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          className="form-control"
          name="category"
          placeholder="e.g., Beverage"
          value={values.category}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          rows="4"
          className="form-control"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Short description of the product..."
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Image</label>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
          className="form-control"
        />
        {values.image && (
          <div className="mt-2">
            <img
              src={values.image}
              alt="Preview"
              style={{ maxHeight: 140 }}
              className="rounded"
            />
            <div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mt-2"
                onClick={() => setValues((s) => ({ ...s, image: "" }))}
              >
                Remove Image
              </button>
            </div>
          </div>
        )}
      </div>

      <button className="btn btn-primary">{submitText}</button>
    </form>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
