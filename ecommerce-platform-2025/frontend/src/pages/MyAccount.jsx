// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/account.css";

export default function MyAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef(null);

  // ---- Page state ----
  const [loading, setLoading] = useState(true);
  const [savingPic, setSavingPic] = useState(false);
  const [error, setError] = useState("");

  // ---- User state (role-based fields supported) ----
  const [user, setUser] = useState({
    id: "",
    username: "",
    role: "", // "customer" | "vendor" | "shipper"
    name: "", // customer only
    address: "", // customer only
    businessName: "", // vendor
    businessAddress: "", // vendor
    distributionHub: "", // shipper
    email: "", // optional
    phone: "", // optional
    profileUrl: "", // avatar url
  });

  const base = import.meta?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  // ---- Load current user (redirect to /login if unauthenticated) ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${base}/api/auth/me`, {
          credentials: "include",
        });
        if (res.status === 401) {
          // Not logged in → go to login and remember where user came from
          navigate("/login", { replace: true, state: { from: location } });
          return;
        }
        if (!res.ok) throw new Error("Failed to load account.");
        const data = await res.json();

        if (!cancelled) {
          // Normalize to the fields we use
          setUser({
            id: data.id || "",
            username: data.username || "",
            role: data.role || "",
            name: data.name || "",
            address: data.address || "",
            businessName: data.businessName || "",
            businessAddress: data.businessAddress || "",
            distributionHub: data.distributionHub || "",
            email: data.email || "",
            phone: data.phone || "",
            profileUrl: data.profileUrl || "/images/avatar-placeholder.png", // put a placeholder in /public/images if you want
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [base, navigate, location]);

  // ---- Upload new profile picture ----
  async function handlePickProfile() {
    fileRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSavingPic(true);
      setError("");

      const fd = new FormData();
      fd.append("profilePicture", file);

      const res = await fetch(`${base}/api/account/profile-picture`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update profile picture.");
      }

      // Server returns updated URL OR we can hard-refresh the same URL with a cache buster
      const data = await res.json().catch(() => ({}));
      const newUrl = data?.profileUrl || `${user.profileUrl}?t=${Date.now()}`;

      setUser((u) => ({ ...u, profileUrl: newUrl }));
    } catch (err) {
      setError(err.message || "Failed to update profile picture.");
    } finally {
      setSavingPic(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ---- Logout ----
  async function handleLogout() {
    try {
      setError("");
      // Try POST, fall back to GET if backend uses that
      let res = await fetch(`${base}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        res = await fetch(`${base}/api/auth/logout`, {
          credentials: "include",
        });
      }
    } catch (_) {
      // ignore network error; just navigate away
    } finally {
      navigate("/login", { replace: true });
    }
  }

  function roleLabel(r) {
    if (!r) return "";
    return r.charAt(0).toUpperCase() + r.slice(1);
  }

  // Build details rows based on role (and include optional email/phone if present)
  function detailsRows() {
    const rows = [];
    if (user.email) rows.push(["Email", user.email]);
    if (user.phone) rows.push(["Phone", user.phone]);

    if (user.role === "customer") {
      rows.push(["Address", user.address || "—"]);
    } else if (user.role === "vendor") {
      rows.push(["Business Name", user.businessName || "—"]);
      rows.push(["Business Address", user.businessAddress || "—"]);
    } else if (user.role === "shipper") {
      rows.push(["Distribution Hub", user.distributionHub || "—"]);
    }

    // You can add more fields later if needed
    return rows;
  }

  if (loading) {
    return (
      <main className="container py-5 reg-scope" data-nav-skip data-nav-safe>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "40vh" }}
        >
          <div
            className="spinner-border text-secondary"
            role="status"
            aria-label="Loading account"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5 account-scope" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <section className="card border-0 shadow-sm account-card">
            <div className="card-body p-4 p-md-5">
              {/* Header block: Avatar + name/username/role */}
              <div className="d-flex flex-column align-items-center gap-3">
                <div
                  className="account-avatar rounded-circle"
                  style={{ backgroundImage: `url(${user.profileUrl})` }}
                  aria-label="Profile picture"
                />
                <div className="text-center">
                  <p className="h4 fw-bold mb-1">
                    {user.name || user.businessName || user.username}
                  </p>
                  <p className="text-muted mb-1">@{user.username}</p>
                  <p className="text-muted mb-0">{roleLabel(user.role)}</p>
                </div>
              </div>

              {/* Change picture */}
              <div className="d-flex justify-content-center mt-3">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handlePickProfile}
                  disabled={savingPic}
                  data-nav-ignore
                >
                  {savingPic ? "Uploading…" : "Change Profile Picture"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>

              {/* Error message (if any) */}
              {error && (
                <div
                  className="alert alert-danger py-2 mt-3 text-center"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Details table */}
              <h2 className="h5 fw-bold mt-4 mb-2">Account Details</h2>
              <div className="table-responsive border rounded">
                <table className="table mb-0 align-middle account-details-table">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="w-25">
                        Detail
                      </th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsRows().map(([k, v]) => (
                      <tr key={k}>
                        <td className="text-body">{k}</td>
                        <td className="text-muted">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Logout */}
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-underline text-muted"
                  onClick={handleLogout}
                  data-nav-ignore
                >
                  Logout
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
