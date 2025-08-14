// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

export default function RegisterCustomer() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validation rules (from project spec)
  // Username: letters & digits only, length 8–15.
  const usernameOk = useMemo(
    () => /^[A-Za-z0-9]{8,15}$/.test(username),
    [username]
  );

  // Password:
  // - length 8–20
  // - at least one upper, one lower, one digit, one special in !@#$%^&*
  // - only allowed chars: letters, digits, !@#$%^&*
  const passwordOk = useMemo(() => {
    if (password.length < 8 || password.length > 20) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    if (!/^[A-Za-z0-9!@#$%^&*]+$/.test(password)) return false;
    return true;
  }, [password]);

  // Other fields: required, min length 5
  const fullNameOk = fullName.trim().length >= 5;
  const addressOk = address.trim().length >= 5;

  // Profile picture: file upload (assume user selects an image; no content validation needed)
  const profileOk = !!profileFile;

  const formOk =
    usernameOk && passwordOk && fullNameOk && addressOk && profileOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!formOk) return;

    try {
      setSubmitting(true);

      // Build multipart form data (to support file upload)
      const fd = new FormData();
      fd.append("role", "customer");
      fd.append("username", username.trim());
      fd.append("password", password);
      fd.append("name", fullName.trim());
      fd.append("address", address.trim());
      if (profileFile) fd.append("profilePicture", profileFile);

      const base =
        import.meta?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
      const res = await fetch(`${base}/api/auth/register/customer`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        // Expect JSON { message: "..."} from backend; fallback to generic
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Registration failed.");
      }

      // Success → go to login or straight to account if the flow does auto-login
      navigate("/login", { replace: true });
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-5 reg-scope" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <section className="card border-0 shadow-sm reg-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-1 reg-title">
                Create your account
              </h2>

              <form className="mt-4" noValidate onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Username</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      username ? (usernameOk ? "is-valid" : "is-invalid") : ""
                    }`}
                    placeholder="Choose a unique username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {!usernameOk && username.length > 0 && (
                    <div className="invalid-feedback">
                      8–15 letters or digits, no spaces or symbols.
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Password</label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${
                      password ? (passwordOk ? "is-valid" : "is-invalid") : ""
                    }`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && !passwordOk && (
                    <div className="invalid-feedback">
                      8–20 chars, include upper, lower, digit, and one of
                      !@#$%^&*. Only those characters are allowed.
                    </div>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="mb-3">
                  <label className="form-label fw-medium d-block">
                    Profile Picture
                  </label>
                  <div className="upload-box border border-2 border-dashed rounded-3 p-4 text-center">
                    <p className="fw-bold mb-1">Profile Picture</p>
                    <p className="text-muted small mb-3">
                      Upload a profile picture
                    </p>
                    <label className="btn btn-outline-dark">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={(e) =>
                          setProfileFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {profileFile && (
                      <p className="small mt-2 mb-0 text-truncate">
                        Selected:{" "}
                        <span className="fw-medium">{profileFile.name}</span>
                      </p>
                    )}
                  </div>
                  {!profileOk && (
                    <div className="form-text text-danger mt-2">
                      Please choose an image file.
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Full Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      fullName ? (fullNameOk ? "is-valid" : "is-invalid") : ""
                    }`}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {fullName && !fullNameOk && (
                    <div className="invalid-feedback">
                      Minimum 5 characters.
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="mb-2">
                  <label className="form-label fw-medium">Address</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      address ? (addressOk ? "is-valid" : "is-invalid") : ""
                    }`}
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {address && !addressOk && (
                    <div className="invalid-feedback">
                      Minimum 5 characters.
                    </div>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg"
                    disabled={!formOk || submitting}
                    data-nav-ignore
                  >
                    {submitting ? "Signing up…" : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
