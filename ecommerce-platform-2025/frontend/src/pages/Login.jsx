// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="container py-5" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <section className="card border-0 shadow-sm login-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-1 login-title">
                Welcome Back
              </h2>

              <form
                className="mt-4"
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  if (!username.trim() || !password.trim()) {
                    setError("Please enter both username and password.");
                    return;
                  }
                  try {
                    setSubmitting(true);

                    // Adjust the URL to match backend (kept generic and safe).
                    const base =
                      import.meta?.env?.VITE_API_BASE_URL?.replace(
                        /\/+$/,
                        ""
                      ) || "";
                    const res = await fetch(`${base}/api/auth/login`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include", // if use cookie sessions
                      body: JSON.stringify({ username, password }),
                    });

                    if (!res.ok) {
                      const msg = (await res.json().catch(() => ({})))?.message;
                      throw new Error(msg || "Invalid username or password.");
                    }

                    const data = await res.json().catch(() => ({}));
                    const role = data?.role;

                    const from = location.state?.from?.pathname;

                    if (from) {
                      navigate(from, { replace: true });
                    } else if (role === "vendor") {
                      navigate("/vendor/products", { replace: true });
                    } else if (role === "shipper") {
                      navigate("/shipper/orders", { replace: true });
                    } else if (role === "customer") {
                      navigate("/products", { replace: true });
                    } else {
                      // Fallback if role is unknown:
                      navigate("/account", { replace: true });
                    }
                  } catch (err) {
                    setError(err.message || "Login failed. Please try again.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Username</label>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="form-control form-control-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="form-label fw-medium">Password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2 mt-2" role="alert">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg"
                    disabled={submitting}
                    // This attribute helps some transition libs ignore this click.
                    data-nav-ignore
                  >
                    {submitting ? "Logging in…" : "Login"}
                  </button>
                </div>

                {/* Helpers */}
                <p className="text-center text-muted small mt-3 mb-0">
                  Don’t have an account?{" "}
                  <Link to="/register" className="link-underline">
                    Register Now
                  </Link>
                </p>
                <p className="text-center small mt-2 mb-0">
                  <Link to="/help" className="link-underline">
                    Forgot Password?
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
