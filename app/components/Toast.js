// ═══════════════════════════════════════════════════════════════════
// TOAST — Notification popup (success, error, warning, info)
// Props: msg, type, onClose
// ═══════════════════════════════════════════════════════════════════
"use client";

export default function Toast(props) {
  if (!props.msg) return null;

  const type = props.type || "success";
  const colorMap = {
    success: "var(--ok)",
    error: "var(--er)",
    warning: "var(--wr)",
    info: "var(--pr)"
  };
  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i"
  };

  return (
    <div
      onClick={props.onClose}
      style={{
        position: "fixed",
        bottom: 20,
        insetInlineStart: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        padding: "12px 20px",
        background: colorMap[type],
        color: "#fff",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        animation: "toastIn .3s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: "90vw",
        cursor: "pointer",
        fontFamily: "inherit"
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(255,255,255,.2)",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 800
        }}
      >
        {iconMap[type]}
      </span>
      <span>{props.msg}</span>
    </div>
  );
}
