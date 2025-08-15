import React from "react";

export default function ProductCard({ img, title, subtitle, className = "" }) {
  return (
    <div
      className={`card shadow-sm border-0 rounded-3 overflow-hidden h-100 ${className}`}
    >
      <div
        className="ratio ratio-1x1 bg-cover"
        style={{ backgroundImage: `url(${img})` }}
        aria-label={title}
      />
      <div className="card-body">
        <h5 className="card-title h5 mb-1">{title}</h5>
        <p className="card-text text-muted mb-0">{subtitle}</p>
      </div>
    </div>
  );
}
