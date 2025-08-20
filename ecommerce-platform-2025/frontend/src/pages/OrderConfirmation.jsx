// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/order-confirmation.css";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";

const TAX_RATE = 0.05;
const SHIPPING_COST = 0;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function OrderConfirmation() {
  const q = useQuery();
  const id = q.get("id");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // Load from API when id present; otherwise try sessionStorage fallback
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (id) {
          const { data } = await api.get(`/api/orders/${id}`);
          if (!mounted) return;
          setOrder(data);
        } else {
          const fallback = JSON.parse(
            sessionStorage.getItem("lastOrder") || "{}"
          );
          if (fallback?.id || fallback?._id) setOrder(fallback);
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message || "Could not load your order details.";
        setError(msg);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Normalize for UI
  const ui = useMemo(() => {
    if (!order) return null;
    const code = order.code || order.id || order._id;
    const items = (order.items || []).map((it, idx) => ({
      key: it.id || it._id || idx,
      name: it.productName || it.name || "Item",
      qty: it.quantity ?? it.qty ?? 1,
      price: Number(it.price || 0),
    }));
    const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total =
      typeof order.total === "number"
        ? order.total
        : subtotal + tax + SHIPPING_COST;

    return {
      code,
      assignedHub: order.distributionHub || "Central Distribution Hub",
      items,
      subtotal,
      tax,
      total,
    };
  }, [order]);

  if (error) {
    return (
      <main className="container py-5" data-nav-safe>
        <div className="text-center py-5">
          <h1 className="h4 fw-bold mb-2">Order error</h1>
          <p className="text-muted">{error}</p>
          <Link to="/products" className="btn btn-dark">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  if (!ui) {
    return (
      <main className="container py-5" data-nav-safe>
        <div className="text-center py-5">
          <h1 className="h4 fw-bold mb-2">No recent order</h1>
          <Link to="/products" className="btn btn-dark">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5 oc-scope" data-nav-safe>
      <div className="mx-auto oc-max">
        {/* Breadcrumb-ish header */}
        <div className="d-flex flex-wrap gap-2 px-3 px-sm-4">
          <Link to="/orders" className="text-muted text-decoration-none">
            Orders
          </Link>
          <span className="text-muted">/</span>
          <span className="text-dark">Order Details</span>
        </div>

        {/* Title / Order number */}
        <div className="d-flex flex-wrap justify-content-between gap-3 px-3 px-sm-4 mt-2">
          <h1 className="oc-title mb-0">Order #{ui.code}</h1>
        </div>

        {/* Assigned hub */}
        <h2 className="section-title px-3 px-sm-4 pt-3">Assigned Hub</h2>
        <div className="px-3 px-sm-4">
          <div className="oc-hub">
            <div className="oc-hub-icon" aria-hidden="true">
              {/* warehouse icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M240,184h-8V57.9l9.67-2.08a8,8,0,1,0-3.35-15.64l-224,48A8,8,0,0,0,16,104a8.16,8.16,0,0,0,1.69-.18L24,102.47V184H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,99,216,61.33V184H192V128a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v56H40Zm136,53H80V136h96ZM80,168h96v16H80Z" />
              </svg>
            </div>
            <p className="mb-0 flex-1">{ui.assignedHub}</p>
          </div>
        </div>

        {/* Products table */}
        <h2 className="section-title px-3 px-sm-4 pt-3">Products</h2>
        <section className="px-3 px-sm-4">
          <div className="table-wrap">
            <table className="oc-table">
              <thead>
                <tr>
                  <th className="col-prod">Product</th>
                  <th className="col-qty">Quantity</th>
                  <th className="col-price">Price</th>
                </tr>
              </thead>
              <tbody>
                {ui.items.map((it) => (
                  <tr key={it.key}>
                    <td className="col-prod">{it.name}</td>
                    <td className="col-qty text-muted">{it.qty}</td>
                    <td className="col-price text-muted">
                      {formatCurrency(it.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <h2 className="section-title px-3 px-sm-4 pt-3">Totals</h2>
        <section className="px-3 px-sm-4">
          <div className="oc-summary">
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(ui.subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Shipping</span>
              <span>
                {SHIPPING_COST ? formatCurrency(SHIPPING_COST) : "Free"}
              </span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Tax</span>
              <span>{formatCurrency(ui.tax)}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Total</span>
              <span>{formatCurrency(ui.total)}</span>
            </div>
          </div>
        </section>

        {/* Status + CTA */}
        <h2 className="section-title px-3 px-sm-4 pt-3">Order Status</h2>
        <p className="px-3 px-sm-4 text-body">
          Your order has been successfully placed and is being processed. You
          will receive a notification when it ships.
        </p>

        <div className="px-3 px-sm-4 pb-3">
          <Link to="/products" className="btn btn-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
