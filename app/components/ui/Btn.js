// ═══════════════════════════════════════════════════════════════════
// BUTTON — Primary, Ghost, Danger variants with animations
// Variants: primary (default) | ghost | danger
// Sizes: sm | md (default) | lg
// Props: full, loading, disabled, onClick, style
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function Btn(props) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const variant = props.variant || "primary";
  const size = props.size || "md";
  const disabled = props.disabled || props.loading;

  let bg, color, borderColor, shadow;
  if (variant === "ghost") {
    bg = hover ? "var(--b3)" : "var(--cd)";
    color = "var(--tx)";
    borderColor = "var(--bd)";
    shadow = hover ? "0 2px 8px var(--sh2)" : "none";
  } else if (variant === "danger") {
    bg = hover ? "#C93E35" : "var(--er)";
    color = "#fff";
    borderColor = "transparent";
    shadow = hover ? "0 6px 20px rgba(212,69,60,.35)" : "0 2px 6px rgba(212,69,60,.2)";
  } else {
    bg = hover ? "#4A5BE0" : "var(--pr)";
    color = "#fff";
    borderColor = "transparent";
    shadow = hover ? "0 8px 24px var(--sh)" : "0 2px 8px var(--sh)";
  }

  const sizeMap = {
    sm: { padding: "7px 14px", fontSize: 11 },
    md: { padding: "10px 22px", fontSize: 12 },
    lg: { padding: "13px 30px", fontSize: 14 }
  };
  const sz = sizeMap[size] || sizeMap.md;

  const scale = pressed ? 0.97 : hover ? 1.03 : 1;

  const style = {
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 700,
    fontFamily: "inherit",
    background: disabled ? "var(--t3)" : bg,
    color: disabled ? "#fff" : color,
    border: variant === "ghost" ? `1px solid ${borderColor}` : "none",
    borderRadius: 10,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: props.full ? "100%" : "auto",
    boxShadow: disabled ? "none" : shadow,
    transform: disabled ? "scale(1)" : `scale(${scale})`,
    transition: "transform 0.18s cubic-bezier(.4,0,.2,1), background 0.2s, box-shadow 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    outline: "none",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
    ...props.style
  };

  return (
    <button
      type={props.type || "button"}
      onClick={disabled ? undefined : props.onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={style}
    >
      {props.loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid rgba(255,255,255,.3)",
            borderTop: "2px solid #fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            display: "inline-block"
          }}
        />
      )}
      {props.children}
    </button>
  );
}
