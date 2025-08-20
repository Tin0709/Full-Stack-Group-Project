// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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

import { setUser } from "../redux/slices/userSlice";
import { registerCustomer } from "../services/authService";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validation
  const usernameOk = validateUsername(username);
  const passwordOk = validatePassword(password);
  const fullNameOk = minLen(5)(fullName);
  const addressOk = minLen(5)(address);
  const profileOk = !!profileFile;

  const formOk =
    usernameOk && passwordOk && fullNameOk && addressOk && profileOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formOk || submitting) return;

    setServerError("");
    setSubmitting(true);
    try {
      const user = await registerCustomer({
        username: username.trim(),
        password,
        fullName: fullName.trim(),
        address: address.trim(),
        profileFile, // sent as "profilePicture"
      });

      dispatch(setUser(user));
      navigate("/role", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setServerError(msg);
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
              <p className="text-center text-muted mb-4">
                Customers can browse products and place orders after sign-in.
              </p>

              <form className="mt-3" noValidate onSubmit={handleSubmit}>
                <UsernameField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <UploadBox
                  file={profileFile}
                  onFile={setProfileFile}
                  label="Profile Picture"
                  helperText="Drag & drop or click to upload (JPG/PNG)"
                />

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
                  loadingText="Creating…"
                  disabled={!formOk || submitting}
                  className="mt-3"
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
