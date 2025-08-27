/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
Semester: 2025B
Assessment: Assignment 02
Author: Nguyen Trung Tin
ID: s3988418
*/

import React, { useRef, useState, useEffect } from "react";

export default function HorizontalScroller({
  children,
  ariaLabel = "Featured products",
}) {
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

  const stopRAF = () => {
    if (motion.current.raf) cancelAnimationFrame(motion.current.raf);
    motion.current.raf = null;
  };

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el) return;

    // left button / primary pointer only
    if (e.button !== 0 && e.pointerType !== "touch") return;

    setDragging(true);
    el.setPointerCapture?.(e.pointerId);

    stopRAF();
    motion.current.v = 0;
    motion.current.lastX = e.pageX;
    motion.current.lastT = performance.now();
  };

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || !dragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - motion.current.lastT); // avoid div/0
    const dx = e.pageX - motion.current.lastX;

    // move the scroller (drag to scroll horizontally)
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
      motion.current.v *= Math.pow(FRICTION, dt / 16.67);

      if (Math.abs(motion.current.v) < 0.01) {
        motion.current.v = 0;
      }

      if (motion.current.v !== 0) {
        motion.current.raf = requestAnimationFrame(step);
      } else {
        stopRAF();
      }
    };

    stopRAF();
    motion.current.raf = requestAnimationFrame(step);
  };

  const onPointerUp = (e) => {
    const el = ref.current;
    if (!el) return;
    setDragging(false);
    el.releasePointerCapture?.(e.pointerId);

    // kick off momentum after drag ends
    if (Math.abs(motion.current.v) > 0.01) {
      startMomentum();
    }
  };

  // IMPORTANT: improved wheel handling
  // - Vertical wheels bubble to the page (so the page keeps scrolling)
  // - We only hijack when the intent is horizontal (trackpad side-swipe or Shift+wheel)
  // - If we’re at an edge, let the event bubble so the page can continue
  const onWheel = (e) => {
    const el = ref.current;
    if (!el) return;

    const { deltaX, deltaY, shiftKey } = e;

    // horizontal intent: trackpad moving sideways OR Shift+wheel
    const horizontalIntent = Math.abs(deltaX) > Math.abs(deltaY) || shiftKey;
    if (!horizontalIntent) {
      // vertical scroll -> let the page handle it
      return;
    }

    // choose the horizontal delta: prefer native deltaX, else use deltaY (Shift+Wheel)
    const h = Math.abs(deltaX) > 0 ? deltaX : deltaY;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft >= maxScroll - 1;
    const goingLeft = h < 0;
    const goingRight = h > 0;

    // if we cannot scroll further in that direction, don't block the page
    if ((goingLeft && atStart) || (goingRight && atEnd)) {
      return;
    }

    el.scrollLeft += h;
    e.preventDefault();
  };

  // Arrow key nudge
  const onKeyDown = (e) => {
    const el = ref.current;
    if (!el) return;
    const step = 80;
    if (e.key === "ArrowRight") {
      el.scrollLeft += step;
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      el.scrollLeft -= step;
      e.preventDefault();
    }
  };

  useEffect(() => {
    // Prevent accidental text selection during drag
    document.body.style.userSelect = dragging ? "none" : "";
    return () => stopRAF(); // cleanup on unmount
  }, [dragging]);

  return (
    <div
      ref={ref}
      className={`home-scroll ${dragging ? "is-dragging" : ""}`}
      role="region"
      aria-label={ariaLabel}
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
