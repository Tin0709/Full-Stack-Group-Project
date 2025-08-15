// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Nguyen Trung Tin
// ID: S3988418

import React, { useEffect, useRef } from "react";
import "./styles/help.css";
import { Link } from "react-router-dom";

function FAQItem({ question, children, defaultOpen = false }) {
  const contentRef = useRef(null);

  const onToggle = (e) => {
    const details = e.currentTarget;
    const el = contentRef.current;
    if (!el) return;

    if (details.open) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
  };

  useEffect(() => {
    const el = contentRef.current;
    if (el && defaultOpen) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    }
  }, [defaultOpen]);

  return (
    <details className="help-item" open={defaultOpen} onToggle={onToggle}>
      <summary className="help-summary">
        <span>{question}</span>
        <span className="chev" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div ref={contentRef} className="help-content">
        <div className="help-body">{children}</div>
      </div>
    </details>
  );
}

export default function Help() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "SwiftShip • Help Center";
  }, []);

  return (
    <main className="help-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold display-6 mb-4">Help Center</h1>

          <h2 className="h4 fw-bold mt-4 mb-3">Account</h2>
          <div className="d-flex flex-column gap-3">
            <FAQItem question="How do I create an account?" defaultOpen>
              To create an account, click on the "Register" button and follow
              the instructions. You’ll provide your username, password, and
              (depending on role) profile details.
            </FAQItem>
            <FAQItem question="How do I reset my password?">
              Use the “Forgot password?” link on the Login page and follow the
              prompts to receive a reset link.
            </FAQItem>
            <FAQItem question="How do I update my profile information?">
              After logging in, go to <strong>My Account</strong> to change your
              profile picture and edit your information. Save to apply changes.
            </FAQItem>
          </div>

          <h2 className="h4 fw-bold mt-5 mb-3">Orders</h2>
          <div className="d-flex flex-column gap-3">
            <FAQItem question="How do I place an order?" defaultOpen>
              Browse products, add items to your cart, then proceed to checkout.
              Enter your shipping and payment information to confirm.
            </FAQItem>
            <FAQItem question="How do I track my order?">
              Tracking is shown on the order details page. For shipped orders,
              status updates appear as the shipper changes them.
            </FAQItem>
            <FAQItem question="How do I cancel an order?">
              If your order hasn’t been processed yet, you can cancel it from
              the cart/order page. Otherwise, contact the vendor for assistance.
            </FAQItem>
          </div>

          <h2 className="h4 fw-bold mt-5 mb-3">Shipping</h2>
          <div className="d-flex flex-column gap-3">
            <FAQItem question="What are the shipping options?" defaultOpen>
              Standard, expedited, and express options may be available. Cost
              and timing vary by destination and method.
            </FAQItem>
            <FAQItem question="How long does shipping take?">
              Delivery time depends on the chosen method and your location.
              Estimated dates appear at checkout.
            </FAQItem>
            <FAQItem question="How do I handle a damaged shipment?">
              Take photos and contact the vendor promptly. The shipper’s status
              will be updated after resolution.
            </FAQItem>
          </div>

          <h2 className="h4 fw-bold mt-5 mb-3">Products</h2>
          <div className="d-flex flex-column gap-3">
            <FAQItem question="How do I list a product?" defaultOpen>
              Vendors: open <strong>Add New Product</strong>, then fill in name,
              price, image, and description (max 500 chars).
            </FAQItem>
            <FAQItem question="How do I manage my product listings?">
              Use <strong>View My Products</strong> to edit details or remove
              listings. Changes take effect immediately.
            </FAQItem>
            <FAQItem question="How do I handle returns?">
              Returns are managed by vendors according to their policy.
              Coordinate directly with the buyer and update the order status
              accordingly.
            </FAQItem>
          </div>

          <p className="text-muted small text-center mt-5">
            Still need help? <Link to="/about">Contact Us</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
