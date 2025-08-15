// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/cart.css";
import {
  getCart,
  setQty,
  removeItem,
  clearCart,
} from "../services/cartService";
import { formatCurrency } from "../utils/format";

const TAX_RATE = 0.05; // matches earlier mock
const SHIPPING_COST = 0; // keep “Free” like before (UI still matches)

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());

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

  function placeOrder() {
    const order = {
      id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      items: cart.items,
      subtotal,
      tax,
      shipping: SHIPPING_COST,
      total,
      assignedHub: "Central Distribution Hub", // placeholder until backend logic exists
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("lastOrder", JSON.stringify(order));
    clearCart();
    navigate("/order-confirmation", { replace: true });
  }

  return (
    <main className="container py-5 cart-scope" data-nav-safe>
      <div className="mx-auto cart-max">
        <header className="d-flex flex-wrap justify-content-between gap-3 px-3 px-sm-4 mb-2">
          <h1 className="cart-title mb-0">Shopping Cart</h1>
        </header>

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
                            className="btn btn-link text-danger text-decoration-underline p-0"
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

              <div className="d-flex justify-content-end px-1 mt-3">
                <button
                  className="btn btn-dark btn-lg"
                  onClick={placeOrder}
                  data-nav-ignore
                >
                  Place Order
                </button>
              </div>

              <div className="mt-3">
                <Link
                  to="/products"
                  className="btn btn-link text-decoration-underline"
                >
                  ← Continue shopping
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
