// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Nguyen Trung Tin
// ID: S3988418

import React, { useEffect } from "react";
import "./styles/help.css";

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

          {/* Account */}
          <h2 className="h4 fw-bold mt-4 mb-3">Account</h2>
          <div className="d-flex flex-column gap-3">
            <details className="help-item" open>
              <summary className="help-summary">
                <span>How do I create an account?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                To create an account, click on the "Register" button and follow
                the instructions. You’ll provide your username, password, and
                (depending on role) profile details.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I reset my password?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Use the “Forgot password?” link on the Login page and follow the
                prompts to receive a reset link.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I update my profile information?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                After logging in, go to <strong>My Account</strong> to change
                your profile picture and edit your information. Save to apply
                changes.
              </p>
            </details>
          </div>

          {/* Orders */}
          <h2 className="h4 fw-bold mt-5 mb-3">Orders</h2>
          <div className="d-flex flex-column gap-3">
            <details className="help-item" open>
              <summary className="help-summary">
                <span>How do I place an order?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Browse products, add items to your cart, then proceed to
                checkout. Enter your shipping and payment information to
                confirm.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I track my order?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Tracking is shown on the order details page. For shipped orders,
                status updates appear as the shipper changes them.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I cancel an order?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                If your order hasn’t been processed yet, you can cancel it from
                the cart/order page. Otherwise, contact the vendor for
                assistance.
              </p>
            </details>
          </div>

          {/* Shipping */}
          <h2 className="h4 fw-bold mt-5 mb-3">Shipping</h2>
          <div className="d-flex flex-column gap-3">
            <details className="help-item" open>
              <summary className="help-summary">
                <span>What are the shipping options?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Standard, expedited, and express options may be available. Cost
                and timing vary by destination and method.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How long does shipping take?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Delivery time depends on the chosen method and your location.
                Estimated dates appear at checkout.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I handle a damaged shipment?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Take photos and contact the vendor promptly. The shipper’s
                status will be updated after resolution.
              </p>
            </details>
          </div>

          {/* Products */}
          <h2 className="h4 fw-bold mt-5 mb-3">Products</h2>
          <div className="d-flex flex-column gap-3">
            <details className="help-item" open>
              <summary className="help-summary">
                <span>How do I list a product?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Vendors: open <strong>Add New Product</strong>, then fill in
                name, price, image, and description (max 500 chars).
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I manage my product listings?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Use <strong>View My Products</strong> to edit details or remove
                listings. Changes take effect immediately.
              </p>
            </details>

            <details className="help-item">
              <summary className="help-summary">
                <span>How do I handle returns?</span>
                <span className="chev" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="help-body">
                Returns are managed by vendors according to their policy.
                Coordinate directly with the buyer and update the order status
                accordingly.
              </p>
            </details>
          </div>

          <p className="text-muted small text-center mt-5">
            Still need help?{" "}
            <a href="mailto:support@swiftship.com">Contact Us</a>
          </p>
        </div>
      </div>
    </main>
  );
}
