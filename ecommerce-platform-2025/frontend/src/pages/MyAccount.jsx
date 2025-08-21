// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/account.css";

import { me, logout } from "../services/authService";
import { api } from "../services/api";

const API_BASE = import.meta.env.VITE_API_BASE;
const toAbsolute = (u) => {
  if (!u) return u;
  // already absolute (http/https)
  if (/^https?:\/\//i.test(u)) return u;
  // relative path from API
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return u;
};
// Online placeholder image
const AVATAR_PLACEHOLDER =
  "https://static.vecteezy.com/system/resources/thumbnails/028/569/170/small_2x/single-man-icon-people-icon-user-profile-symbol-person-symbol-businessman-stock-vector.jpg";

export default function MyAccount() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [savingPic, setSavingPic] = useState(false);
  const [error, setError] = useState("");

  // What we show
  const [user, setUser] = useState({
    id: "",
    username: "",
    role: "",
    // extended (may be empty if backend doesn't return them)
    fullName: "",
    address: "",
    businessName: "",
    businessAddress: "",
    distributionHub: "",
    email: "",
    phone: "",
    profileUrl: AVATAR_PLACEHOLDER,
  });

  // Load session + (optionally) extended profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Minimal session info
        const u = await me(); // { id, username, role }
        if (!mounted) return;

        let next = {
          id: u.id || "",
          username: u.username || "",
          role: u.role || "",
          profileUrl: AVATAR_PLACEHOLDER,
        };

        // Try to fetch extended profile if the endpoint exists.
        // If it 404s or fails, we’ll just keep the basics.
        try {
          const { data } = await api.get("/api/account/me");
          next = {
            ...next,
            fullName: data.fullName || "",
            address: data.address || "",
            businessName: data.businessName || "",
            businessAddress: data.businessAddress || "",
            distributionHub: data.distributionHub || "",
            email: data.email || "",
            phone: data.phone || "",
            profileUrl:
              data.profilePictureUrl ||
              data.profilePicture || // support either key
              AVATAR_PLACEHOLDER,
          };
        } catch {
          // optional route not present yet – ignore
        }

        if (mounted) setUser(next);
      } catch {
        // not logged in → back to login
        navigate("/login", { replace: true, state: { from: "/account" } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Upload new profile picture (optional endpoint)
  const handlePickProfile = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSavingPic(true);
    try {
      const fd = new FormData();
      fd.append("profilePicture", file);

      // If this route isn't implemented yet, this request will 404 and we show a friendly error.
      const { data } = await api.post("/api/account/profile-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl =
        data?.profilePictureUrl ||
        data?.profilePicture ||
        `${user.profileUrl}?t=${Date.now()}`;
      setUser((u) => ({ ...u, profileUrl: newUrl }));
    } catch {
      setError("Profile picture update isn’t enabled yet on the server.");
    } finally {
      setSavingPic(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const roleLabel = (r) => (r ? r[0].toUpperCase() + r.slice(1) : "");

  const rows = [];
  const displayName = user.fullName || user.businessName || user.username;

  if (user.role === "customer") {
    rows.push(["Full Name", user.fullName || "—"]);
    rows.push(["Address", user.address || "—"]);
  } else if (user.role === "vendor") {
    rows.push(["Business Name", user.businessName || "—"]);
    rows.push(["Business Address", user.businessAddress || "—"]);
  } else if (user.role === "shipper") {
    rows.push(["Distribution Hub", user.distributionHub || "—"]);
  }
  if (user.email) rows.push(["Email", user.email]);
  if (user.phone) rows.push(["Phone", user.phone]);

  if (loading) {
    return (
      <main className="container py-5">
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
    <main className="container py-5" data-nav-skip data-nav-safe>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <section className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Avatar + summary */}
              <div className="d-flex flex-column align-items-center gap-3">
                <img
                  src={toAbsolute(user.profileUrl) || AVATAR_PLACEHOLDER}
                  onError={(e) => (e.currentTarget.src = AVATAR_PLACEHOLDER)}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: 128, height: 128, objectFit: "cover" }}
                />

                <div className="text-center">
                  <p className="h4 fw-bold mb-1">{displayName}</p>
                  <p className="text-muted mb-1">@{user.username}</p>
                  <p className="text-muted mb-0">{roleLabel(user.role)}</p>
                </div>
              </div>

              {/* Change picture (only works if backend endpoint exists) */}
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

              {error && (
                <div
                  className="alert alert-danger py-2 mt-3 text-center"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Details */}
              <h2 className="h5 fw-bold mt-4 mb-2">Account Details</h2>
              <div className="table-responsive border rounded">
                <table className="table mb-0 align-middle">
                  <thead className="bg-white">
                    <tr>
                      <th className="w-25">Detail</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-muted">
                          No extra details available yet.
                        </td>
                      </tr>
                    ) : (
                      rows.map(([k, v]) => (
                        <tr key={k}>
                          <td className="text-body">{k}</td>
                          <td className="text-muted">{v}</td>
                        </tr>
                      ))
                    )}
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
