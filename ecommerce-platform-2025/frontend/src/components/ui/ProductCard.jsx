import React from "react";

/**
 * Backward-compatible product card.
 * Use either:
 *   <ProductCard product={p} onView={...} onAdd={...} />
 * or the legacy API:
 *   <ProductCard img="..." title="..." subtitle="..." />
 */
export default function ProductCard({
  product,
  onView,
  onAdd,
  img,
  title,
  subtitle,
  className = "",
}) {
  // New path (preferred): use `product`
  if (product) {
    const image = product.image || img || "";
    const name = product.name || title || "";
    const sub =
      subtitle ??
      (product.price != null ? `$${Number(product.price).toFixed(2)}` : "");

    return (
      <div
        className={`card shadow-sm border-0 rounded-3 overflow-hidden h-100 ${className}`}
      >
        <div
          className="ratio ratio-1x1 bg-cover"
          style={{ backgroundImage: `url(${image})` }}
          aria-label={name}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title h5 mb-1">{name}</h5>
          <p className="card-text text-muted mb-3">{sub}</p>
          {(onView || onAdd) && (
            <div className="mt-auto d-flex gap-2">
              {onView && (
                <button
                  className="btn btn-outline-dark flex-fill"
                  onClick={onView}
                >
                  View Details
                </button>
              )}
              {onAdd && (
                <button
                  className="btn btn-dark flex-fill"
                  onClick={onAdd}
                  data-nav-ignore
                >
                  Add to Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Legacy/simple card path
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
