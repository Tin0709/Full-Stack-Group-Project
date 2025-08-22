
import React from "react";
export default function MetricCard({ title, value, subtext }){
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h6 className="text-muted mb-2">{title}</h6>
        <div className="display-6 fw-semibold">{value}</div>
        {subtext && <div className="text-secondary small mt-2">{subtext}</div>}
      </div>
    </div>
  );
}
