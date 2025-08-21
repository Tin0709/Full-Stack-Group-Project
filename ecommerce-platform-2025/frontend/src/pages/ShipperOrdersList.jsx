// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./styles/shipper-orders.css";

const fmtMoney = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n)
    : "—";
const fmtDate = (d) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t) ? t.toISOString().slice(0, 10) : "—";
};

// normalize API shapes to what the table needs
function normalizeOrders(list = []) {
  return list.map((o) => {
    const id = o._id || o.id || o.orderId || o.code || "";
    const code = o.orderId || o.code || `#${String(id).slice(-6)}`;
    const customerName =
      o.customer?.fullName ||
      o.customer?.name ||
      o.receiverName ||
      o.customerName ||
      "—";
    const createdAt = o.createdAt || o.orderDate || o.created_on || null;
    const total =
      typeof o.total === "number"
        ? o.total
        : typeof o.amount === "number"
        ? o.amount
        : null;
    const status =
      (o.status || "").toLowerCase() ||
      (o.state || "").toLowerCase() ||
      "processing";

    return {
      id: String(id),
      code: String(code),
      customerName,
      createdAt,
      total,
      status,
    };
  });
}

export default function ShipperOrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all"); // all | open | completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Try a shipper-scoped endpoint; fall back to generic.
        let data;
        try {
          ({ data } = await api.get("/api/shipper/orders"));
        } catch {
          try {
            ({ data } = await api.get("/api/orders/assigned"));
          } catch {
            ({ data } = await api.get("/api/orders"));
          }
        }
        if (!mounted) return;
        const normalized = normalizeOrders(Array.isArray(data) ? data : []);
        // optional: newest first
        normalized.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
        setOrders(normalized);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "Could not load your orders. Please try again.";
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
    const openStatuses = new Set([
      "processing",
      "packed",
      "in_transit",
      "shipped",
      "out_for_delivery",
    ]);
    const completedStatuses = new Set(["delivered", "canceled", "cancelled"]);

    return orders.filter((o) => {
      // tab filter
      if (tab === "open" && !openStatuses.has(o.status)) return false;
      if (tab === "completed" && !completedStatuses.has(o.status)) return false;

      // search filter
      if (!term) return true;
      return (
        o.code.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term)
      );
    });
  }, [orders, q, tab]);

  const onRowClick = (id) => navigate(`/shipper/orders/${id}`);

  return (
    <main className="container py-4 shipper-orders" data-nav-skip data-nav-safe>
      {/* Page header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-2 mb-2">
        <h1 className="h3 fw-bold mb-0">Orders</h1>
        <button type="button" className="btn btn-soft" disabled>
          Create Order
        </button>
      </div>

      {/* Search */}
      <div className="px-2 mb-2">
        <div className="input-group search-wrap">
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            type="search"
            className="form-control bg-light border-0"
            placeholder="Search by Order ID or Customer Name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-underline px-2 mb-3">
        <button
          className={`tab-link ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All Orders
        </button>
        <button
          className={`tab-link ${tab === "open" ? "active" : ""}`}
          onClick={() => setTab("open")}
        >
          Open Orders
        </button>
        <button
          className={`tab-link ${tab === "completed" ? "active" : ""}`}
          onClick={() => setTab("completed")}
        >
          Completed Orders
        </button>
      </div>

      {/* Content card */}
      <section className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5 d-flex justify-content-center">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-muted">No orders found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-white">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Total</th>
                    <th style={{ width: 120 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="border-top row-click"
                      role="button"
                      onClick={() => onRowClick(o.id)}
                    >
                      <td className="text-body">{o.code}</td>
                      <td className="text-muted">{o.customerName}</td>
                      <td className="text-muted">{fmtDate(o.createdAt)}</td>
                      <td className="text-muted">{fmtMoney(o.total)}</td>
                      <td>
                        <span className={`status-pill ${o.status}`}>
                          {o.status[0].toUpperCase() + o.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
