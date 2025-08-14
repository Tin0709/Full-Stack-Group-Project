import React from "react";

export default function StepCard({ img, title, desc }) {
  return (
    <div className="col-12 col-md-4 d-flex">
      <div className="card shadow-sm flex-fill border-0 rounded-3 overflow-hidden">
        <div
          className="ratio ratio-16x9 bg-cover"
          style={{ backgroundImage: `url(${img})` }}
          aria-label={title}
        />
        <div className="card-body">
          <h5 className="h6 mb-1">{title}</h5>
          <p className="small text-muted mb-0">{desc}</p>
        </div>
      </div>
    </div>
  );
}
