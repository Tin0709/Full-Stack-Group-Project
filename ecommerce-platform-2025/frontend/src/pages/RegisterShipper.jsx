// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

export default function RegisterShipper() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hub, setHub] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ===== Validation rules (from assignment) =====
  // Username: letters & digits only, 8–15
  const usernameOk = useMemo(
    () => /^[A-Za-z0-9]{8,15}$/.test(username),
    [username]
  );

  // Password:
  // 8–20 length; ≥1 upper, ≥1 lower, ≥1 digit, ≥1 of !@#$%^&*; only those chars allowed
  const passwordOk = useMemo(() => {
    if (password.length < 8 || password.length > 20) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    if (!/^[A-Za-z0-9!@#$%^&*]+$/.test(password)) return false;
    return true;
  }, [password]);

  // Profile picture required; hub required (dropdown)
  const profileOk = !!profileFile;
  const hubOk = !!hub;

  const formOk = usernameOk && passwordOk && profileOk && hubOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!formOk) return;

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("role", "shipper");
      fd.append("username", username.trim());
      fd.append("password", password);
      fd.append("distributionHub", hub);
      if (profileFile) fd.append("profilePicture", profileFile);

      const base =
        import.meta?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
      const res = await fetch(`${base}/api/auth/register/shipper`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Registration failed.");
      }

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
                Create your shipper account
              </h2>

              <form className="mt-4" noValidate onSubmit={handleSubmit}>
                {/* Distribution Hub */}
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Distribution Hub
                  </label>
                  <select
                    className={`form-select form-select-lg ${
                      hub ? "is-valid" : ""
                    }`}
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                  >
                    <option value="">Select a hub…</option>
                    <option value="Ho Chi Minh">Ho Chi Minh</option>
                    <option value="Da Nang">Da Nang</option>
                    <option value="Hanoi">Hanoi</option>
                  </select>
                  {!hubOk && (
                    <div className="form-text text-danger mt-2">
                      Please choose a distribution hub.
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Username</label>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a unique username"
                    className={`form-control form-control-lg ${
                      username ? (usernameOk ? "is-valid" : "is-invalid") : ""
                    }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {username && !usernameOk && (
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
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`form-control form-control-lg ${
                      password ? (passwordOk ? "is-valid" : "is-invalid") : ""
                    }`}
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
                <div className="mb-2">
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
                    {submitting ? "Creating…" : "Create Account"}
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
