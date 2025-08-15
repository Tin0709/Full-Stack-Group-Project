import React from "react";

export default function SelectField({
  label,
  value,
  onChange,
  options, // [{value,label}]
  placeholder = "Select...",
  validator, // (value) => boolean
  invalidMsg,
}) {
  const touched = (value ?? "") !== "";
  const ok = validator ? validator(value) : true;
  const vClass = touched ? (ok ? "is-valid" : "is-invalid") : "";

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">{label}</label>
      <select
        className={`form-select form-select-lg ${vClass}`}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {touched && !ok && invalidMsg && (
        <div className="form-text text-danger mt-2">{invalidMsg}</div>
      )}
    </div>
  );
}
