// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Nguyen Trung Tin
// ID: S3988418

import React, { useEffect } from "react";
import "./styles/privacy.css";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "SwiftShip • Privacy Policy";
  }, []);

  return (
    <main className="privacy-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h1 className="fw-bold display-6 mb-4">Privacy Policy</h1>

          <section>
            <h3 className="h5 fw-bold">1. Acceptance of Terms</h3>
            <p>
              By accessing or using the SwiftShip platform, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">2. Services Provided</h3>
            <p>
              SwiftShip provides an e-commerce platform that allows customers to
              purchase goods, vendors to sell goods, and shippers to manage
              deliveries. We facilitate transactions but are not directly
              involved in the sale or delivery of goods.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">3. User Accounts</h3>
            <p>
              You must create an account to use certain features of our
              platform. You are responsible for maintaining the confidentiality
              of your account information and for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">4. Payments and Fees</h3>
            <p>
              Payments for goods are processed through our secure payment
              gateway. Vendors are responsible for any fees associated with
              selling on our platform. Shippers are paid according to their
              agreed-upon rates.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">5. Shipping and Delivery</h3>
            <p>
              We are not responsible for shipping or delivery of goods. These
              are the responsibilities of the vendors and shippers. Any disputes
              regarding shipping or delivery should be resolved between the
              customer, vendor, and shipper.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">6. Returns and Refunds</h3>
            <p>
              Return and refund policies are determined by the vendors.
              SwiftShip is not responsible for handling returns or refunds.
              Customers should contact vendors directly for any return or refund
              requests.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">7. Prohibited Activities</h3>
            <p>
              You agree not to engage in any prohibited activities, including
              but not limited to: fraudulent transactions, sale of illegal or
              prohibited items, violation of intellectual property rights,
              harassment or abuse of other users, or any activity that violates
              applicable laws or regulations.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">8. Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account at any
              time, with or without cause, if you violate these Terms of
              Service.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">9. Disclaimer of Warranties</h3>
            <p>
              SwiftShip provides the platform on an "as is" and "as available"
              basis. We make no warranties, express or implied, regarding the
              platform's functionality, reliability, or availability.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">10. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, SwiftShip shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">11. Governing Law</h3>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the jurisdiction in which SwiftShip is
              based.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">12. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              Your continued use of the platform constitutes your acceptance of
              the new terms.
            </p>
          </section>

          <section>
            <h3 className="h5 fw-bold">13. Contact Information</h3>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a href="mailto:support@swiftship.com">support@genz.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
