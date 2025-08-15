import React from "react";

export default function PrimaryButton({
  children,
  loading = false,
  loadingText = "Submitting…",
  disabled,
  type = "submit",
}) {
  return (
    <div className="d-grid mt-4">
      <button
        type={type}
        className="btn btn-dark btn-lg"
        disabled={disabled || loading}
        data-nav-ignore
      >
        {loading ? loadingText : children}
      </button>
    </div>
  );
}
