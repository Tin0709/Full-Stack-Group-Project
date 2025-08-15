import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="h4 fw-bold mb-1 text-dark">{title}</h2>
      {subtitle && <p className="mb-0 text-muted">{subtitle}</p>}
    </div>
  );
}
