// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418
import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/cart.css";
import {
  getCart,
  setQty,
  removeItem,
  clearCart,
} from "../services/cartService";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";

const TAX_RATE = 0.05;
const SHIPPING_COST = 0;
const HUBS = ["Ho Chi Minh", "Da Nang", "Hanoi"];

function inferHub(address = "") {
  const a = (address || "").toLowerCase();
  if (a.includes("đà nẵng") || a.includes("da nang")) return "Da Nang";
  if (a.includes("hà nội") || a.includes("ha noi") || a.includes("hanoi"))
    return "Hanoi";
  return "Ho Chi Minh";
}
function isHex24(v) {
  return /^[0-9a-fA-F]{24}$/.test(String(v || ""));
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [profile, setProfile] = useState(null);

  const [hub, setHub] = useState("");
  const [hubTouched, setHubTouched] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Receiver modal state (React-only, no Bootstrap JS)
  const [showRxModal, setShowRxModal] = useState(false);
  const [rxName, setRxName] = useState("");
  const [rxAddr, setRxAddr] = useState("");
  const [rxPhone, setRxPhone] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/api/account/me");
        if (!mounted) return;
        setProfile(data);
        setHub(inferHub(data?.address || ""));
        setRxName((data?.fullName || data?.username || "").trim());
        setRxAddr(data?.address || "");
        setRxPhone(data?.phone || "");
      } catch {
        setProfile(null);
        setHub("");
      }
    })();
    return () => (mounted = false);
  }, []);

  const { subtotal, tax, total } = useMemo(() => {
    const sub = cart.items.reduce((s, it) => s + it.price * it.qty, 0);
    const t = Math.round(sub * TAX_RATE * 100) / 100;
    return { subtotal: sub, tax: t, total: sub + t + SHIPPING_COST };
  }, [cart]);

  function updateQty(id, q) {
    const next = setQty(id, q);
    setCart({ ...next });
  }
  function removeRow(id) {
    const next = removeItem(id);
    setCart({ ...next });
  }

  function buildOrderItems() {
    return cart.items.map((it) => {
      const candidateId = it._id || it.id || it.productId;
      return {
        productId: isHex24(candidateId) ? String(candidateId) : undefined,
        productName: it.name,
        quantity: Number(it.qty || 1),
        price: Number(it.price || 0),
      };
    });
  }

  function hasReceiverFromProfile() {
    const name =
      (profile?.fullName && profile.fullName.trim()) || profile?.username || "";
    const addr = profile?.address || "";
    const phone = profile?.phone || "";
    return !!(name && addr && phone);
  }

  async function placeOrder() {
    if (!cart.items.length || placing) return;

    if (!hub) {
      setHubTouched(true);
      setError("Please choose a distribution hub before placing your order.");
      return;
    }

    if (hasReceiverFromProfile()) {
      const receiver = {
        name: (profile?.fullName || profile?.username || "").trim(),
        address: profile?.address || "",
        phone: profile?.phone || "",
      };
      await submitOrder(receiver);
    } else {
      // show React-only modal (no z-index/backdrop bugs)
      setShowRxModal(true);
    }
  }

  async function submitOrder(receiver) {
    try {
      setPlacing(true);
      setError("");

      const items = buildOrderItems();
      const { data: order } = await api.post("/api/orders", {
        items,
        receiver,
        distributionHub: hub,
        paymentMethod: "Cash on Delivery",
      });

      clearCart();
      navigate(`/order-confirmation?id=${order._id}`, { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (Array.isArray(data?.errors) && data.errors.length
          ? `Validation error:\n- ${data.errors.join("\n- ")}`
          : data?.message) || "Could not place order. Please try again.";
      setError(msg);
    } finally {
      setPlacing(false);
    }
  }

  async function confirmReceiverFromModal() {
    if (!rxName.trim() || !rxAddr.trim() || !rxPhone.trim()) return;
    setShowRxModal(false);
    await submitOrder({
      name: rxName.trim(),
      address: rxAddr.trim(),
      phone: rxPhone.trim(),
    });
  }

  return (
    <main className="container py-5 cart-scope" data-nav-safe>
      <div className="mx-auto cart-max">
        {/* Title: centered if empty, left if has items */}
        <header
          className={`px-3 px-sm-4 mb-2 ${
            cart.items.length === 0 ? "text-center" : ""
          }`}
        >
          <h1 className="cart-title mb-0">Shopping Cart</h1>
        </header>

        {error && (
          <div
            className="alert alert-danger mx-3 mx-sm-4"
            role="alert"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {error}
          </div>
        )}

        {cart.items.length === 0 ? (
          <div className="text-center text-muted py-5">
            Your cart is empty.
            <div className="mt-3">
              <Link className="btn btn-dark" to="/products">
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <section className="px-3 px-sm-4">
              <div className="table-wrap">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th className="col-product">Product</th>
                      <th className="col-price">Price</th>
                      <th className="col-qty">Quantity</th>
                      <th className="col-total">Total</th>
                      <th className="col-actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((it) => (
                      <tr key={it.id}>
                        <td className="col-product">
                          <div className="d-flex align-items-center gap-3">
                            <Link
                              to={`/products/${it.id}`}
                              className="cart-thumb rounded-circle"
                              style={{ backgroundImage: `url(${it.image})` }}
                              aria-label={it.name}
                            />
                            <div>
                              <Link
                                to={`/products/${it.id}`}
                                className="link-dark link-underline-opacity-0 link-underline-opacity-75-hover"
                              >
                                {it.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="col-price text-muted">
                          {formatCurrency(it.price)}
                        </td>
                        <td className="col-qty">
                          <div className="input-group input-group-sm cart-qty">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => updateQty(it.id, it.qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={it.qty}
                              onChange={(e) => updateQty(it.id, e.target.value)}
                              className="form-control text-center"
                              aria-label="Quantity"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => updateQty(it.id, it.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="col-total text-muted">
                          {formatCurrency(it.price * it.qty)}
                        </td>
                        <td className="col-actions text-end">
                          <button
                            type="button"
                            className="btn btn-link text-danger"
                            onClick={() => removeRow(it.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Order summary */}
            <section className="px-3 px-sm-4 mt-4">
              <h2 className="section-title">Order Summary</h2>
              <div className="summary-block">
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Shipping</span>
                  <span>
                    {SHIPPING_COST ? formatCurrency(SHIPPING_COST) : "Free"}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between py-1 fw-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Distribution Hub */}
              <div className="mt-3">
                <label className="form-label fw-semibold" htmlFor="hub-select">
                  Distribution Hub <span className="text-danger">*</span>
                </label>
                <select
                  id="hub-select"
                  className={`form-select ${
                    hubTouched && !hub ? "is-invalid" : ""
                  }`}
                  value={hub}
                  onChange={(e) => {
                    setHub(e.target.value);
                    if (!hubTouched) setHubTouched(true);
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a hub…
                  </option>
                  {HUBS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  We picked one based on your address—you can change it.
                </div>
                <div className="invalid-feedback">Please choose a hub.</div>
              </div>

              <div className="d-flex justify-content-end px-1 mt-3">
                <button
                  className="btn btn-dark btn-lg"
                  onClick={placeOrder}
                  disabled={placing || !hub}
                  data-nav-ignore
                >
                  {placing ? "Placing…" : "Place Order"}
                </button>
              </div>

              <div className="mt-3">
                <Link to="/products" className="btn btn-outline-dark back-btn">
                  ← Continue shopping
                </Link>
              </div>
            </section>
          </>
        )}
      </div>

      {/* React-only Receiver Modal (no Bootstrap JS, no body/backdrop hacking) */}
      {showRxModal &&
        createPortal(
          <div
            onClick={() => setShowRxModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="modal d-block"
              style={{ position: "relative", width: "100%", maxWidth: 520 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Receiver Information</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowRxModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Full name</label>
                      <input
                        className="form-control"
                        value={rxName}
                        onChange={(e) => setRxName(e.target.value)}
                        placeholder="Your full name"
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={rxAddr}
                        onChange={(e) => setRxAddr(e.target.value)}
                        placeholder="Street, district, city"
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        value={rxPhone}
                        onChange={(e) => setRxPhone(e.target.value)}
                        placeholder="+84 9xx xxx xxx"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setShowRxModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-dark"
                      type="button"
                      onClick={confirmReceiverFromModal}
                      disabled={
                        !rxName.trim() || !rxAddr.trim() || !rxPhone.trim()
                      }
                    >
                      Confirm & Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </main>
  );
}
