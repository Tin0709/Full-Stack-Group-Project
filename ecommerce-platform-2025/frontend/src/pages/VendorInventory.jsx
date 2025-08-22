
import React, { useMemo, useState } from "react";
import { listProducts } from "../services/vendorProductService";
import { listInventoryLogs } from "../services/inventoryLogService";
import { adjustStock } from "../services/inventoryHelper";
import { exportToCSV } from "../utils/csv";

export default function VendorInventory() {
  const [products, setProducts] = useState(listProducts());
  const [logs, setLogs] = useState(listInventoryLogs());
  const [form, setForm] = useState({ productId: products[0]?.id || "", delta: 0, reason: "Restock" });

  function refresh() {
    setProducts(listProducts());
    setLogs(listInventoryLogs());
  }

  function submit() {
    if (!form.productId) return;
    adjustStock(form.productId, Number(form.delta || 0), form.reason || "");
    setForm({ ...form, delta: 0, reason: "Restock" });
    refresh();
  }

  const table = useMemo(() => logs.map(l => ({
    Date: new Date(l.date).toLocaleString(),
    Product: l.productName,
    Delta: l.delta,
    Reason: l.reason
  })), [logs]);

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Inventory</h2>
        <button className="btn btn-outline-secondary" onClick={() => exportToCSV("inventory_logs.csv", table)}>
          Export CSV
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">Product</label>
              <select className="form-select" value={form.productId} onChange={e=>setForm({ ...form, productId: e.target.value })}>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock: {p.stock})</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Change (Δ)</label>
              <input type="number" className="form-control" value={form.delta} onChange={e=>setForm({ ...form, delta: e.target.value })} />
              <div className="form-text">Positive: restock, Negative: adjustment</div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Reason</label>
              <input className="form-control" value={form.reason} onChange={e=>setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="col-md-2 d-grid align-items-end">
              <button className="btn btn-primary mt-4" onClick={submit}>Apply</button>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr><th>Date</th><th>Product</th><th>Δ</th><th>Reason</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{new Date(l.date).toLocaleString()}</td>
                <td>{l.productName}</td>
                <td className={Number(l.delta)>=0 ? "text-success" : "text-danger"}>{l.delta}</td>
                <td>{l.reason}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No inventory logs</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
