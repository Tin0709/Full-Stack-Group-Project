// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/order-confirmation.css";
import { formatCurrency } from "../utils/format";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const order = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("lastOrder") || "{}");
    } catch {
      return {};
    }
  }, []);

  if (!order?.id) {
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
          <h1 className="oc-title mb-0">Order #{order.id}</h1>
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
            <p className="mb-0 flex-1">
              {order.assignedHub || "Central Distribution Hub"}
            </p>
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
                {order.items?.map((it) => (
                  <tr key={it.id}>
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
              <span>{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Shipping</span>
              <span>
                {order.shipping ? formatCurrency(order.shipping) : "Free"}
              </span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Tax</span>
              <span>{formatCurrency(order.tax || 0)}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Total</span>
              <span>{formatCurrency(order.total || 0)}</span>
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
