// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import "./styles/shipper-order-details.css";

const fmtMoney = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n)
    : "—";

const fmtDate = (d) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t)
    ? t.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
};

// Normalize API → UI shape
function normalizeOrder(o = {}) {
  // Some endpoints wrap the order
  if (o && typeof o === "object" && o.order) o = o.order;
  if (o && typeof o === "object" && o.data) o = o.data;

  const id = o._id || o.id || o.orderId || o.code || "";
  const code = o.orderId || o.code || `#${String(id).slice(-6)}`;
  const createdAt = o.createdAt || o.orderDate || o.created_on || null;
  const total =
    typeof o.total === "number"
      ? o.total
      : typeof o.amount === "number"
      ? o.amount
      : null;
  const payment =
    o.paymentMethod ||
    o.payment ||
    (o.isCOD ? "Cash on Delivery" : "Credit Card");
  const status = (o.status || o.state || "processing").toLowerCase();

  // Receiver/shipping block from various shapes
  const ship = o.shipping || o.receiver || o.address || {};

  // Resolve hub robustly (used as City)
  const distributionHub =
    (typeof o.distributionHub === "string" && o.distributionHub) ||
    o.distributionHubName ||
    o.distribution_hub ||
    o.assignedHub ||
    o.assigned_hub ||
    (typeof o.hub === "string" ? o.hub : o.hub?.name) ||
    ship.hub ||
    null;

  // Resolve phone from common places
  const phone =
    ship.phone ||
    ship.phoneNumber ||
    ship.mobile ||
    o.receiverPhone ||
    o.phone ||
    o.customer?.phone ||
    null;

  const recv = {
    name:
      o.receiverName ||
      ship.name ||
      ship.fullName ||
      o.customer?.fullName ||
      o.customer?.name ||
      "—",
    address: ship.address || ship.street || ship.line1 || "—",
    // City shows the hub; fall back to any existing city if present
    city: distributionHub || ship.city || "—",
    phone: phone || "—",
  };

  const rawItems = o.items || o.productItems || o.products || [];
  const items = rawItems.map((it) => ({
    id: it._id || it.id || "",
    name: it.productName || it.name || it.title || "—",
    qty: it.quantity || it.qty || 1,
    price:
      typeof it.price === "number"
        ? it.price
        : typeof it.unitPrice === "number"
        ? it.unitPrice
        : null,
  }));

  return {
    id: String(id),
    code: String(code),
    createdAt,
    total,
    payment,
    status,
    distributionHub: distributionHub || "—", // kept for completeness
    receiver: recv,
    items,
  };
}

export default function ShipperOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);
  const [confirm, setConfirm] = useState({ show: false, action: null }); // "deliver" | "cancel"

  // Load order (prefer shipper route → fallback generic)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        let rsp;
        try {
          rsp = await api.get(`/api/shipper/orders/${id}`);
        } catch {
          rsp = await api.get(`/api/orders/${id}`);
        }
        const payload = rsp?.data?.order ?? rsp?.data?.data ?? rsp?.data; // unwrap {order} or {data}
        if (mounted) setOrder(normalizeOrder(payload)); // set exactly once
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Could not load order. Please try again."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Esc to close dialog
  useEffect(() => {
    function onKey(e) {
      if (!confirm.show) return;
      if (e.key === "Escape" && !acting)
        setConfirm({ show: false, action: null });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm.show, acting]);

  const statusText = useMemo(
    () =>
      order?.status
        ? order.status[0].toUpperCase() + order.status.slice(1)
        : "—",
    [order]
  );

  async function act(action) {
    if (!order?.id) return;
    try {
      setActing(true);
      setError("");
      if (action === "deliver") {
        try {
          await api.post(`/api/shipper/orders/${order.id}/deliver`);
        } catch {
          await api.patch(`/api/orders/${order.id}`, { status: "delivered" });
        }
        setOrder((o) => ({ ...o, status: "delivered" }));
      } else if (action === "cancel") {
        try {
          await api.post(`/api/shipper/orders/${order.id}/cancel`);
        } catch {
          await api.patch(`/api/orders/${order.id}`, { status: "canceled" });
        }
        setOrder((o) => ({ ...o, status: "canceled" }));
      }
      setConfirm({ show: false, action: null });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <main className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-secondary" role="status" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main
      className="container py-4 shipper-order-details"
      data-nav-skip
      data-nav-safe
    >
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-2">
                <h1 className="h3 fw-bold mb-0">Order {order.code}</h1>
                <span className={`status-pill ${order.status}`}>
                  {statusText}
                </span>
              </div>

              {/* Order Details */}
              <h2 className="h6 fw-bold mt-3 mb-2">Order Details</h2>
              <div className="detail-grid">
                <div className="row-item">
                  <div className="label">Order Date</div>
                  <div className="value">{fmtDate(order.createdAt)}</div>
                </div>
                <div className="row-item">
                  <div className="label">Status</div>
                  <div className="value">{statusText}</div>
                </div>
                <div className="row-item">
                  <div className="label">Total</div>
                  <div className="value">{fmtMoney(order.total)}</div>
                </div>
                <div className="row-item">
                  <div className="label">Payment Method</div>
                  <div className="value">{order.payment || "—"}</div>
                </div>
              </div>

              {/* Shipping Address */}
              <h2 className="h6 fw-bold mt-4 mb-2">Shipping Address</h2>
              <div className="detail-grid">
                <div className="row-item">
                  <div className="label">Name</div>
                  <div className="value">{order.receiver.name}</div>
                </div>
                <div className="row-item">
                  <div className="label">Address</div>
                  <div className="value">{order.receiver.address}</div>
                </div>
                <div className="row-item">
                  <div className="label">City</div>
                  <div className="value">{order.receiver.city}</div>
                </div>
                <div className="row-item">
                  <div className="label">Phone</div>
                  <div className="value">{order.receiver.phone}</div>
                </div>
              </div>

              {/* Products */}
              <h2 className="h6 fw-bold mt-4 mb-2">Products</h2>
              <div className="table-responsive border rounded">
                <table className="table mb-0 align-middle">
                  <thead className="bg-white">
                    <tr>
                      <th>Product</th>
                      <th style={{ width: 120 }}>Quantity</th>
                      <th style={{ width: 140 }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-muted text-center">
                          No products in this order.
                        </td>
                      </tr>
                    ) : (
                      order.items.map((it, idx) => (
                        <tr key={it.id || idx} className="border-top">
                          <td className="text-body">{it.name}</td>
                          <td className="text-muted">{it.qty}</td>
                          <td className="text-muted">{fmtMoney(it.price)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-dark-strong"
                  onClick={() => setConfirm({ show: true, action: "deliver" })}
                  disabled={acting || order.status === "delivered"}
                >
                  {acting && confirm.action === "deliver"
                    ? "Updating…"
                    : "Mark Delivered"}
                </button>
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => setConfirm({ show: true, action: "cancel" })}
                  disabled={
                    acting ||
                    order.status === "canceled" ||
                    order.status === "delivered"
                  }
                >
                  {acting && confirm.action === "cancel"
                    ? "Updating…"
                    : "Mark Canceled"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal rendered via portal (always on top) */}
      {confirm.show &&
        createPortal(
          <div
            className="sod-portal-overlay"
            onClick={() => !acting && setConfirm({ show: false, action: null })}
          >
            <div
              className="sod-portal-card"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sod-portal-header">
                <h5 className="mb-0">
                  {confirm.action === "deliver"
                    ? "Mark as Delivered"
                    : "Mark as Canceled"}
                </h5>
                <button
                  type="button"
                  className="sod-portal-close"
                  aria-label="Close"
                  onClick={() =>
                    !acting && setConfirm({ show: false, action: null })
                  }
                />
              </div>
              <div className="sod-portal-body">
                {confirm.action === "deliver"
                  ? "Are you sure you want to mark this order as Delivered?"
                  : "Are you sure you want to mark this order as Canceled?"}
                {order?.code && (
                  <p className="text-muted mb-0 mt-2">
                    <span className="fw-semibold">Order:</span> {order.code}
                  </p>
                )}
              </div>
              <div className="sod-portal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setConfirm({ show: false, action: null })}
                  disabled={acting}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`btn ${
                    confirm.action === "deliver"
                      ? "btn-dark-strong"
                      : "btn-soft"
                  }`}
                  onClick={() => act(confirm.action)}
                  disabled={acting}
                >
                  {acting ? "Working…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </main>
  );
}
