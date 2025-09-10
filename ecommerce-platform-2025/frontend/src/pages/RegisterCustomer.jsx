// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";
import React, { useEffect, useMemo } from "react";

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

// Lottie assets
import loginLeftAnim from "../assets/animations/LoginLeft.json";
import loginRightAnim from "../assets/animations/LoginRight.json";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [profileFile, setProfileFile] = React.useState(null);

  // UX state
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  // Validation
  const formOk = useMemo(() => {
    const usernameOk = validateUsername(username);
    const passwordOk = validatePassword(password);
    const fullNameOk = minLen(5)(fullName);
    const addressOk = minLen(5)(address);
    const profileOk = !!profileFile;
    return usernameOk && passwordOk && fullNameOk && addressOk && profileOk;
  }, [username, password, fullName, address, profileFile]);

  async function handleSubmit(e) {
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

  // If user prefers reduced motion, pause animations
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const root = document.querySelector(".reg-scope.pop-page");
    if (!root) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId;

    if (prefersReduced) {
      // If reduced motion is preferred, add the class immediately
      root.classList.add("in");
    } else {
      // Otherwise, trigger the class addition on the next animation frame
      // so CSS transitions can fire correctly.
      animationFrameId = requestAnimationFrame(() => {
        root.classList.add("in");
      });
    }

    return () => {
      // Cleanup function
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      root.classList.remove("in");
    };
  }, []);

  return (
    <main
      className="container py-5 reg-scope pop-page"
      data-nav-skip
      data-nav-safe
    >
      <div className="row g-4 align-items-stretch justify-content-center">
        {/* LEFT: Lottie (hidden on < lg) */}
        <aside
          className="col-lg-4 d-none d-lg-block reveal"
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

        {/* CENTER: Form */}
        <div
          className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 reveal"
          style={{ "--stagger": 1 }}
        >
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

        {/* RIGHT: Lottie (hidden on < lg) */}
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
