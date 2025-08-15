import React from "react";
import { validateUsername } from "../../utils/validation";

export default function UsernameField({
  value,
  onChange,
  label = "Username",
  placeholder = "Choose a unique username",
}) {
  const touched = (value ?? "") !== "";
  const ok = validateUsername(value);
  const vClass = touched ? (ok ? "is-valid" : "is-invalid") : "";

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">{label}</label>
      <input
        type="text"
        className={`form-control form-control-lg ${vClass}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="username"
      />
      {touched && !ok && (
        <div className="invalid-feedback">
          8–15 letters or digits, no spaces or symbols.
        </div>
      )}
    </div>
  );
}
