// ═══════════════════════════════════════════════════════════════════
// CARD — Container with optional hover lift animation
// Props: padding, hover, onClick, style, children
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function Card(props) {
  const [hover, setHover] = useState(false);
  const isInteractive = typeof props.onClick === "function" || props.hover === true;

  const style = {
    background: "var(--cd)",
    border: "1px solid var(--bd)",
    borderRadius: 12,
    padding: props.padding !== undefined ? props.padding : 18,
    transition: "transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s, border-color 0.2s",
    cursor: props.onClick ? "pointer" : "default",
    transform: isInteractive && hover ? "translateY(-2px)" : "translateY(0)",
    boxShadow: isInteractive && hover
      ? "0 10px 28px var(--sh2)"
      : "0 1px 3px rgba(0,0,0,.02)",
    borderColor: isInteractive && hover ? "var(--pr)" : "var(--bd)",
    ...props.style
  };

  return (
    <div
      onClick={props.onClick}
      onMouseEnter={() => isInteractive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
    >
      {props.children}
    </div>
  );
}
