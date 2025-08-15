import React, { useState } from "react";
import { validatePassword } from "../../utils/validation";

function EyeIcon({ off = false, size = 18 }) {
  // Simple eye / eye-off icons via inline SVG (no external libs)
  if (off) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M3 3 L21 21" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  placeholder = "Create a strong password",
}) {
  const [show, setShow] = useState(false);
  const touched = (value ?? "") !== "";
  const ok = validatePassword(value);
  const vClass = touched ? (ok ? "is-valid" : "is-invalid") : "";

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">{label}</label>
      <div className="input-group">
        <input
          type={show ? "text" : "password"}
          className={`form-control form-control-lg ${vClass}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="btn btn-outline-secondary password-toggle-btn"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide password" : "Show password"}
        >
          <EyeIcon off={show} />
          <span className="visually-hidden">{show ? "Hide" : "Show"}</span>
        </button>
      </div>
      {touched && !ok && (
        <div className="invalid-feedback d-block">
          8–20 chars, include upper, lower, digit, and one of !@#$%^&*. Only
          those characters are allowed.
        </div>
      )}
    </div>
  );
}
