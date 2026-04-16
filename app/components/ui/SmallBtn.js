// ═══════════════════════════════════════════════════════════════════
// SMALL BUTTON — Compact action button for toolbars
// Props: onClick, children, variant
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function SmallBtn(props) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const variant = props.variant || "default";
  const scale = pressed ? 0.93 : hover ? 1.08 : 1;

  let bg, color, border;
  if (variant === "primary") {
    bg = hover ? "#4A5BE0" : "var(--pr)";
    color = "#fff";
    border = "1px solid transparent";
  } else if (variant === "danger") {
    bg = hover ? "rgba(212,69,60,.1)" : "var(--cd)";
    color = "var(--er)";
    border = "1px solid var(--er)";
  } else {
    bg = hover ? "var(--pS)" : "var(--cd)";
    color = "var(--pr)";
    border = hover ? "1px solid var(--pr)" : "1px solid var(--bd)";
  }

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
        padding: "5px 11px",
        background: bg,
        color: color,
        border: border,
        borderRadius: 7,
        fontSize: 10,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transform: `scale(${scale})`,
        transition: "transform 0.15s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s, border 0.2s",
        outline: "none",
        userSelect: "none"
      }}
    >
      {props.children}
    </button>
  );
}
