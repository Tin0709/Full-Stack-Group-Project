// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

import {
  UsernameField,
  PasswordField,
  FormField,
  UploadBox,
  PrimaryButton,
} from "../components/ui";

import {
  validateUsername,
  validatePassword,
  minLen,
} from "../utils/validation";

export default function RegisterCustomer() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const fullNameOk = minLen(5)(fullName);
  const addressOk = minLen(5)(address);
  const usernameOk = validateUsername(username);
  const passwordOk = validatePassword(password);
  const profileOk = !!profileFile;

  const formOk =
    usernameOk && passwordOk && fullNameOk && addressOk && profileOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formOk) return;
    setServerError("");

    try {
      setSubmitting(true);
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
                Create your account
              </h2>

              <form className="mt-4" noValidate onSubmit={handleSubmit}>
                <UsernameField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <UploadBox file={profileFile} onFile={setProfileFile} />

                <FormField
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  validator={minLen(5)}
                  invalidMsg="Minimum 5 characters."
                />

                <FormField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  validator={minLen(5)}
                  invalidMsg="Minimum 5 characters."
                />

                {serverError && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {serverError}
                  </div>
                )}

                <PrimaryButton
                  loading={submitting}
                  loadingText="Signing up…"
                  disabled={!formOk}
                >
                  Sign Up
                </PrimaryButton>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
