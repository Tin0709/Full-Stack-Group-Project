import React from "react";

export default function HorizontalScroller({ children }) {
  return (
    <div className="home-scroll">
      <div className="home-cards">{children}</div>
    </div>
  );
}
