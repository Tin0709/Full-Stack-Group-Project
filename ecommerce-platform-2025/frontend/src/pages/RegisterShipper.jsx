// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";

import "./styles/register.css";

import {
  UsernameField,
  PasswordField,
  UploadBox,
  PrimaryButton,
  SelectField,
} from "../components/ui";

import { validateUsername, validatePassword } from "../utils/validation";
import { setUser } from "../redux/slices/userSlice";
import { registerShipper } from "../services/authService";

// Lottie assets (reuse the same pair as Customer)
import loginLeftAnim from "../assets/animations/LoginLeft.json";
import loginRightAnim from "../assets/animations/LoginRight.json";

export default function RegisterShipper() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hub, setHub] = useState(""); // "Ho Chi Minh" | "Da Nang" | "Hanoi"
  const [profileFile, setProfileFile] = useState(null);

  // UX
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validation
  const formOk = useMemo(() => {
    const usernameOk = validateUsername(username);
    const passwordOk = validatePassword(password);
    const hubOk = !!hub;
    const profileOk = !!profileFile;
    return usernameOk && passwordOk && hubOk && profileOk;
  }, [username, password, hub, profileFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formOk || submitting) return;

    setServerError("");
    setSubmitting(true);
    try {
      const user = await registerShipper({
        username: username.trim(),
        password,
        distributionHub: hub,
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

  // Respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <main className="container py-5 reg-scope" data-nav-skip data-nav-safe>
      <div className="row g-4 align-items-stretch justify-content-center">
        {/* LEFT: Lottie (hidden on < lg) */}
        <aside className="col-lg-4 d-none d-lg-block">
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
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <section className="card border-0 shadow-sm reg-card">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-1 reg-title">
                Create your shipper account
              </h2>
              <p className="text-center text-muted mb-4">
                Shippers can view and update orders assigned to their hub.
              </p>

              <form className="mt-3" noValidate onSubmit={handleSubmit}>
                <SelectField
                  label="Distribution Hub"
                  value={hub}
                  onChange={(e) => setHub(e.target.value)}
                  options={[
                    { value: "Ho Chi Minh", label: "Ho Chi Minh" },
                    { value: "Da Nang", label: "Da Nang" },
                    { value: "Hanoi", label: "Hanoi" },
                  ]}
                  placeholder="Select a hub…"
                  validator={(v) => !!v}
                  invalidMsg="Please choose a distribution hub."
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
                  className="mt-2"
                >
                  Create Account
                </PrimaryButton>
              </form>
            </div>
          </section>
        </div>

        {/* RIGHT: Lottie (hidden on < lg) */}
        <aside className="col-lg-3 d-none d-lg-block">
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
