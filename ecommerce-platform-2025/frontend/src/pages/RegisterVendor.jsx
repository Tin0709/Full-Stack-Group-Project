// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";

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
import { registerVendor } from "../services/authService";
import { api } from "../services/api";

// Lottie assets
import loginLeftAnim from "../assets/animations/LoginLeft.json";
import loginRightAnim from "../assets/animations/LoginRight.json";

export default function RegisterVendor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Validation
  const usernameOk = validateUsername(username);
  const passwordOk = validatePassword(password);
  const bNameOk = minLen(5)(businessName);
  const bAddrOk = minLen(5)(businessAddress);
  const profileOk = !!profileFile;

  const formOk = useMemo(
    () =>
      usernameOk &&
      passwordOk &&
      bNameOk &&
      bAddrOk &&
      profileOk &&
      nameAvailable &&
      addrAvailable,
    [
      usernameOk,
      passwordOk,
      bNameOk,
      bAddrOk,
      profileOk,
      nameAvailable,
      addrAvailable,
    ]
  );

  // Debounced uniqueness checks...
  useEffect(() => {
    if (!bNameOk) {
      setNameAvailable(true);
      return;
    }
    setNameChecking(true);
    clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(async () => {
      try {
        const { data } = await api.get("/api/vendors/unique", {
          params: { businessName: businessName.trim() },
        });
        setNameAvailable(data?.businessNameAvailable ?? true);
      } catch {
        setNameAvailable(true);
      } finally {
        setNameChecking(false);
      }
    }, 400);
    return () => clearTimeout(nameTimer.current);
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
        const { data } = await api.get("/api/vendors/unique", {
          params: { businessAddress: businessAddress.trim() },
        });
        setAddrAvailable(data?.businessAddressAvailable ?? true);
      } catch {
        setAddrAvailable(true);
      } finally {
        setAddrChecking(false);
      }
    }, 400);
    return () => clearTimeout(addrTimer.current);
  }, [businessAddress, bAddrOk]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formOk || submitting) return;

    setServerError("");
    setSubmitting(true);
    try {
      const user = await registerVendor({
        username: username.trim(),
        password,
        businessName: businessName.trim(),
        businessAddress: businessAddress.trim(),
        profileFile,
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
  }

  // Reduced motion + pop-in effect
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const root = document.querySelector(".reg-scope.pop-page");
    if (!root) return;
    let id;
    if (prefersReduced) {
      root.classList.add("in");
    } else {
      id = requestAnimationFrame(() => root.classList.add("in"));
    }
    return () => {
      if (id) cancelAnimationFrame(id);
      root.classList.remove("in");
    };
  }, [prefersReduced]);

  return (
    <main
      className="container py-5 reg-scope pop-page"
      data-nav-skip
      data-nav-safe
    >
      <div className="row g-4 align-items-stretch justify-content-center">
        {/* LEFT Lottie */}
        <aside
          className="col-lg-3 d-none d-lg-block reveal"
          style={{ "--stagger": 0 }}
        >
          <div className="reg-side">
            <div
              className="reg-lottie"
              role="img"
              aria-label="Register illustration left"
            >
              <Lottie
                animationData={loginLeftAnim}
                loop={!prefersReduced}
                autoplay={!prefersReduced}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </div>
          </div>
        </aside>

        {/* CENTER form */}
        <div
          className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 reveal"
          style={{ "--stagger": 1 }}
        >
          <section className="card border-0 shadow-sm reg-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-1 reg-title">
                Create your business account
              </h2>
              <p className="text-center text-muted mb-4">
                Vendors can list, edit, and manage products after sign-in.
              </p>

              <form className="mt-3" noValidate onSubmit={handleSubmit}>
                <FormField
                  label="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  validator={(v) => minLen(5)(v) && nameAvailable}
                  invalidMsg={
                    !minLen(5)(businessName)
                      ? "Minimum 5 characters."
                      : "This business name is already in use."
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
                      : "This business address is already in use."
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

                <UploadBox
                  file={profileFile}
                  onFile={setProfileFile}
                  label="Profile Picture"
                  helperText="Drag & drop or click to upload (JPG/PNG)"
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
                  Create Account
                </PrimaryButton>
              </form>
            </div>
          </section>
        </div>

        {/* RIGHT Lottie */}
        <aside
          className="col-lg-3 d-none d-lg-block reveal"
          style={{ "--stagger": 2 }}
        >
          <div className="reg-side">
            <div
              className="reg-lottie"
              role="img"
              aria-label="Register illustration right"
            >
              <Lottie
                animationData={loginRightAnim}
                loop={!prefersReduced}
                autoplay={!prefersReduced}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
