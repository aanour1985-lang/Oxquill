// ═══════════════════════════════════════════════════════════════════
// CHIP — Filter/selection chip with active state
// Props: active, onClick, children
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function Chip(props) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = props.active;
  const scale = pressed ? 0.95 : hover ? 1.05 : 1;

  const bg = active
    ? "var(--pr)"
    : hover
    ? "var(--b3)"
    : "var(--cd)";

  const border = active
    ? "1px solid var(--pr)"
    : "1px solid var(--bd)";

  const color = active ? "#fff" : "var(--t2)";

  const shadow = active
    ? "0 3px 10px var(--sh)"
    : hover
    ? "0 2px 6px var(--sh2)"
    : "none";

  return (
    <button
      type="button"
      onClick={props.onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        padding: "6px 13px",
        background: bg,
        border: border,
        borderRadius: 99,
        color: color,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        transform: `scale(${scale})`,
        transition: "transform 0.18s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s, box-shadow 0.2s",
        boxShadow: shadow,
        outline: "none",
        userSelect: "none"
      }}
    >
      {props.children}
    </button>
  );
}
