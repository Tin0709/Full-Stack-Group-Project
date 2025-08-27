/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
Semester: 2025B
Assessment: Assignment 02
Author: Nguyen Trung Tin
ID: s3988418
*/

import React from "react";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  validator, // (value) => boolean
  invalidMsg,
  helperText, // small gray text under input (optional)
  className = "",
}) {
  const touched = (value ?? "") !== "";
  const ok = validator ? validator(value) : true;
  const vClass = touched ? (ok ? "is-valid" : "is-invalid") : "";

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">{label}</label>
      <input
        type={type}
        className={`form-control form-control-lg ${vClass} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {touched && !ok && invalidMsg && (
        <div className="invalid-feedback">{invalidMsg}</div>
      )}
      {helperText && <div className="form-text small">{helperText}</div>}
    </div>
  );
}
