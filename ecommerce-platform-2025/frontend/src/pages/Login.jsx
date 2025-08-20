// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { login } from "../services/authService";
import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!username.trim() || !password.trim()) {
      setServerError("Please enter both username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ username: username.trim(), password });
      dispatch(setUser(user));
      const redirect = location.state?.from || "/role";
      navigate(redirect, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Login failed.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-5" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <section className="card border-0 shadow-sm login-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-1 login-title">
                Welcome Back
              </h2>
              <p className="text-center text-muted mb-4">Sign in to continue</p>

              <form className="mt-3" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="form-control form-control-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="password" className="form-label fw-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {serverError && (
                  <div className="alert alert-danger py-2 mt-2" role="alert">
                    {serverError}
                  </div>
                )}

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg"
                    disabled={submitting}
                    data-nav-ignore
                  >
                    {submitting ? "Logging in…" : "Login"}
                  </button>
                </div>

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
