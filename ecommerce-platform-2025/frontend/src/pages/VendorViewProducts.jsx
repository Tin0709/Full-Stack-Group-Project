
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  listProducts,
  onProductsChanged,
} from "../services/vendorProductService.js";

export default function VendorViewProducts() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("updatedAt:desc");
  const [items, setItems] = useState(() => listProducts({ q, sort }));

  useEffect(() => {
    setItems(listProducts({ q, sort }));
  }, [q, sort]);

  useEffect(() => onProductsChanged(() => setItems(listProducts({ q, sort }))), []);

  const total = items.length;

  function confirmDelete(id) {
    if (!confirm("Delete this product?")) return;
    deleteProduct(id);
    setItems(listProducts({ q, sort }));
  }

  return (
    <section>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h1 className="h3 m-0">My Products</h1>
        <div className="d-flex gap-2">
          <input
            placeholder="Search..."
            className="form-control"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link className="btn btn-primary" to="/vendor/add">
            + Add Product
          </Link>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">{total} item{total !== 1 ? "s" : ""}</small>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Sort</span>
          <select
            className="form-select"
            style={{ width: 200 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="updatedAt:desc">Last updated</option>
            <option value="price:asc">Price ↑</option>
            <option value="price:desc">Price ↓</option>
            <option value="name:asc">Name A→Z</option>
            <option value="name:desc">Name Z→A</option>
            <option value="stock:desc">Stock ↑</option>
            <option value="stock:asc">Stock ↓</option>
          </select>
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 64 }}></th>
              <th>Name</th>
              <th style={{ width: 120 }}>Price</th>
              <th style={{ width: 100 }}>Stock</th>
              <th style={{ width: 160 }}>Updated</th>
              <th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      style={{ width: 48, height: 48, objectFit: "cover" }}
                      className="rounded"
                    />
                  ) : (
                    <div
                      className="bg-light rounded"
                      style={{ width: 48, height: 48 }}
                    />
                  )}
                </td>
                <td>
                  <div className="fw-medium">{p.name}</div>
                  <div className="text-muted small">{p.category || "—"}</div>
                </td>
                <td>{formatVND(p.price)}</td>
                <td>{p.stock}</td>
                <td className="text-muted small">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="text-end">
                  <div className="btn-group">
                    <Link
                      className="btn btn-sm btn-outline-secondary"
                      to={"/vendor/products/" + p.id + "/edit"}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No products yet. Click <Link to="/vendor/add">Add Product</Link> to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatVND(n) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
}
