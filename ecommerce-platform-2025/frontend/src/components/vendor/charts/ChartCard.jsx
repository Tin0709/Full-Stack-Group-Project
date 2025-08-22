
import React from "react";

export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{title}</h5>
          {subtitle && <span className="text-muted small">{subtitle}</span>}
        </div>
        <div style={{ width: "100%", height: 300 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
