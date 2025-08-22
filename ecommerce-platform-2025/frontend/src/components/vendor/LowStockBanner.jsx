
import React from "react";
export default function LowStockBanner({ products = [], threshold = 5 }) {
  const low = products.filter(p => Number(p.stock || 0) <= threshold);
  if (low.length === 0) return null;
  return (
    <div className="alert alert-warning mt-3">
      <strong>Low stock:</strong>{" "}
      {low.slice(0,10).map(p => `${p.name} (${p.stock})`).join(", ")}
      {low.length > 10 && `, +${low.length - 10} more`}
    </div>
  );
}
