// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smooth page transitions without extra libs.
 * - Fades & gently slides new route in
 * - Shows a thin top progress bar
 * - Shows an overlay loader with Bootstrap spinner
 *
 * How it works:
 * - We watch location.pathname to infer a route change.
 * - On every change, we show "loading" for at least MIN_MS (feels smooth),
 *   then auto-complete the progress bar and hide the overlay.
 */

const MIN_MS = 450; // minimum visible loading duration for smoothness

export default function NavigationEffects({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // unique key per route to trigger CSS animation on content
  const routeKey = useMemo(
    () => location.pathname + location.search,
    [location]
  );

  useEffect(() => {
    let raf;
    let startTime = performance.now();
    let done = false;

    setLoading(true);
    setProgress(12); // start with a tiny head

    // Fake-but-smooth progress animation (doesn't rely on network)
    const tick = (t) => {
      if (done) return;
      // ease progress toward ~80% while loading
      setProgress((p) => (p < 80 ? p + Math.max(0.5, (80 - p) * 0.05) : p));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const minTimer = setTimeout(() => {
      // complete progress bar after minimum duration
      done = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      // give CSS time to animate the bar to 100% before hiding
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 220);
    }, MIN_MS);

    // cleanup if user bounces very fast
    return () => {
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(minTimer);
    };
  }, [routeKey]);

  return (
    <>
      {/* Top progress bar */}
      <div className={`top-progress ${loading ? "show" : ""}`}>
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Overlay loader */}
      <div
        className={`route-loader ${loading ? "show" : ""}`}
        aria-hidden={!loading}
      >
        <div className="loader-card shadow">
          <div className="spinner-border" role="status" aria-label="Loading" />
          <div className="small mt-2 text-muted">Loading…</div>
        </div>
      </div>

      {/* Animated page container */}
      <div key={routeKey} className="fade-container">
        {children}
      </div>
    </>
  );
}
