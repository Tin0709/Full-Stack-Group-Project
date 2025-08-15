// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useRef, useState } from "react";
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

  // Uniqueness hints
  const [nameChecking, setNameChecking] = useState(false);
  const [addrChecking, setAddrChecking] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(true);
  const [addrAvailable, setAddrAvailable] = useState(true);
  const nameTimer = useRef(null);
  const addrTimer = useRef(null);

  // Validation bits
  const usernameOk = validateUsername(username);
  const passwordOk = validatePassword(password);
  const bNameOk = minLen(5)(businessName);
  const bAddrOk = minLen(5)(businessAddress);
  const profileOk = !!profileFile;

  const formOk =
    usernameOk &&
    passwordOk &&
    bNameOk &&
    bAddrOk &&
    profileOk &&
    nameAvailable &&
    addrAvailable;

  const base = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");

  // Debounced uniqueness checks
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
        setNameAvailable(
          typeof data?.businessNameAvailable === "boolean"
            ? data.businessNameAvailable
            : true
        );
      } catch {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formOk) return;
    setServerError("");

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
                <FormField
                  label="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  validator={(v) => minLen(5)(v) && nameAvailable}
                  invalidMsg={
                    !minLen(5)(businessName)
                      ? "Minimum 5 characters."
                      : "This business name is already in use. Please choose a different name."
                  }
                  helperText={
                    nameChecking ? "Checking availability…" : undefined
                  }
                />

                <FormField
                  label="Business Address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Enter your business address"
                  validator={(v) => minLen(5)(v) && addrAvailable}
                  invalidMsg={
                    !minLen(5)(businessAddress)
                      ? "Minimum 5 characters."
                      : "This business address is already in use. Please choose a different address."
                  }
                  helperText={
                    addrChecking ? "Checking availability…" : undefined
                  }
                />

                <UsernameField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <UploadBox file={profileFile} onFile={setProfileFile} />

                {serverError && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {serverError}
                  </div>
                )}

                <PrimaryButton
                  loading={submitting}
                  loadingText="Creating…"
                  disabled={!formOk}
                >
                  Create Account
                </PrimaryButton>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
