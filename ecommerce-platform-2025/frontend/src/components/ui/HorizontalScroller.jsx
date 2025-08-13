import React, { useRef, useState, useEffect } from "react";

export default function HorizontalScroller({ children }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  // momentum state (px per ms)
  const motion = useRef({
    v: 0,
    lastX: 0,
    lastT: 0,
    raf: null,
  });

  const FRICTION = 0.92; // lower = more slippery (e.g., 0.9)
  const MAX_V = 3; // clamp speed (px/ms)
  const MIN_V = 0.02; // when to stop (px/ms)

  const stopRAF = () => {
    if (motion.current.raf) {
      cancelAnimationFrame(motion.current.raf);
      motion.current.raf = null;
    }
  };

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    stopRAF();
    setDragging(true);
    motion.current.v = 0;
    motion.current.lastX = e.pageX;
    motion.current.lastT = performance.now();
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const el = ref.current;
    if (!el) return;
    const now = performance.now();
    const dx = e.pageX - motion.current.lastX; // how much the mouse moved
    const dt = now - motion.current.lastT || 1;

    // move the scroller
    el.scrollLeft -= dx;

    // estimate velocity (px/ms) with a little smoothing
    const instV = dx / dt;
    motion.current.v = 0.8 * motion.current.v + 0.2 * instV;
    motion.current.v = Math.max(-MAX_V, Math.min(MAX_V, motion.current.v));

    motion.current.lastX = e.pageX;
    motion.current.lastT = now;
  };

  const startMomentum = () => {
    const el = ref.current;
    if (!el) return;

    let last = performance.now();

    const step = (t) => {
      const dt = t - last;
      last = t;

      // apply velocity
      el.scrollLeft -= motion.current.v * dt;

      // bounds check (stop if we hit an edge)
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft <= 0 || el.scrollLeft >= maxScroll) {
        motion.current.v = 0;
      }

      // apply friction (exponential decay by time)
      const k = Math.pow(FRICTION, dt / 16);
      motion.current.v *= k;

      if (Math.abs(motion.current.v) > MIN_V) {
        motion.current.raf = requestAnimationFrame(step);
      } else {
        motion.current.raf = null;
      }
    };

    motion.current.raf = requestAnimationFrame(step);
  };

  const onPointerUp = () => {
    setDragging(false);
    startMomentum();
  };

  const onWheel = (e) => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const onKeyDown = (e) => {
    const el = ref.current;
    if (!el) return;
    const step = 80;
    if (e.key === "ArrowRight") el.scrollLeft += step;
    if (e.key === "ArrowLeft") el.scrollLeft -= step;
  };

  useEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
    return () => stopRAF(); // cleanup on unmount
  }, [dragging]);

  return (
    <div
      ref={ref}
      className={`home-scroll ${dragging ? "is-dragging" : ""}`}
      role="region"
      aria-label="Featured products"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <div className="home-cards">{children}</div>
    </div>
  );
}
