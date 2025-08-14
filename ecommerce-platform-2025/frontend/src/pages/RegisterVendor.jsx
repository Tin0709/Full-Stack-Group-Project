// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

export default function RegisterVendor() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Uniqueness (client-side async hints)
  const [nameChecking, setNameChecking] = useState(false);
  const [addrChecking, setAddrChecking] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(true);
  const [addrAvailable, setAddrAvailable] = useState(true);
  const nameTimer = useRef(null);
  const addrTimer = useRef(null);

  // ===== Validation rules (from spec) =====
  // Username: letters & digits only, 8–15 chars
  const usernameOk = useMemo(
    () => /^[A-Za-z0-9]{8,15}$/.test(username),
    [username]
  );

  // Password:
  // - length 8–20
  // - at least one upper, one lower, one digit, one special in !@#$%^&*
  // - allowed chars: letters, digits, !@#$%^&*
  const passwordOk = useMemo(() => {
    if (password.length < 8 || password.length > 20) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    if (!/^[A-Za-z0-9!@#$%^&*]+$/.test(password)) return false;
    return true;
  }, [password]);

  // Other fields required, min length 5
  const bNameOk = businessName.trim().length >= 5;
  const bAddrOk = businessAddress.trim().length >= 5;

  // Profile picture required (no content validation needed per spec)
  const profileOk = !!profileFile;

  // Overall form valid (incl. uniqueness hints when have enough length)
  const formOk =
    usernameOk &&
    passwordOk &&
    bNameOk &&
    bAddrOk &&
    profileOk &&
    nameAvailable &&
    addrAvailable;

  // ===== Debounced uniqueness checks (optional but nice UX) =====
  // NOTE: Adjust endpoints to match your backend. This assumes:
  //  GET /api/vendors/unique?businessName=...&businessAddress=...
  //  -> { businessNameAvailable: boolean, businessAddressAvailable: boolean }
  const base = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");

  useEffect(() => {
    if (!bNameOk) {
      setNameAvailable(true);
      return;
    }
    setNameChecking(true);
    clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(async () => {
      try {
        const url = `${base}/api/vendors/unique?businessName=${encodeURIComponent(
          businessName.trim()
        )}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        // Fallback to true if shape differs
        setNameAvailable(
          typeof data?.businessNameAvailable === "boolean"
            ? data.businessNameAvailable
            : true
        );
      } catch {
        // On network error, don't block user — assume available
        setNameAvailable(true);
      } finally {
        setNameChecking(false);
      }
    }, 400);
    return () => clearTimeout(nameTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessName, bNameOk]);

  useEffect(() => {
    if (!bAddrOk) {
      setAddrAvailable(true);
      return;
    }
    setAddrChecking(true);
    clearTimeout(addrTimer.current);
    addrTimer.current = setTimeout(async () => {
      try {
        const url = `${base}/api/vendors/unique?businessAddress=${encodeURIComponent(
          businessAddress.trim()
        )}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        setAddrAvailable(
          typeof data?.businessAddressAvailable === "boolean"
            ? data.businessAddressAvailable
            : true
        );
      } catch {
        setAddrAvailable(true);
      } finally {
        setAddrChecking(false);
      }
    }, 400);
    return () => clearTimeout(addrTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessAddress, bAddrOk]);

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!formOk) return;

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("role", "vendor");
      fd.append("username", username.trim());
      fd.append("password", password);
      fd.append("businessName", businessName.trim());
      fd.append("businessAddress", businessAddress.trim());
      if (profileFile) fd.append("profilePicture", profileFile);

      const res = await fetch(`${base}/api/auth/register/vendor`, {
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
                Create your business account
              </h2>

              <form className="mt-4" noValidate onSubmit={handleSubmit}>
                {/* Business Name */}
                <div className="mb-2">
                  <label className="form-label fw-medium">Business Name</label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    className={`form-control form-control-lg ${
                      businessName
                        ? bNameOk && nameAvailable
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  {!bNameOk && businessName && (
                    <div className="invalid-feedback">
                      Minimum 5 characters.
                    </div>
                  )}
                  {bNameOk && businessName && !nameAvailable && (
                    <div className="text-danger small mt-1">
                      This business name is already in use. Please choose a
                      different name.
                    </div>
                  )}
                  {nameChecking && (
                    <div className="form-text small">
                      Checking availability…
                    </div>
                  )}
                </div>

                {/* Business Address */}
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Business Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business address"
                    className={`form-control form-control-lg ${
                      businessAddress
                        ? bAddrOk && addrAvailable
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                  {!bAddrOk && businessAddress && (
                    <div className="invalid-feedback">
                      Minimum 5 characters.
                    </div>
                  )}
                  {bAddrOk && businessAddress && !addrAvailable && (
                    <div className="text-danger small mt-1">
                      This business address is already in use. Please choose a
                      different address.
                    </div>
                  )}
                  {addrChecking && (
                    <div className="form-text small">
                      Checking availability…
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
                  {!usernameOk && username && (
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
