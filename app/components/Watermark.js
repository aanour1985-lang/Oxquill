// ═══════════════════════════════════════════════════════════════════
// WATERMARK — Overlay on free-tier content
// Displays diagonal repeating brand name across the article
// Props: text (default "oxquill.com"), opacity
// ═══════════════════════════════════════════════════════════════════
"use client";

export default function Watermark(props) {
  const text = props.text || "oxquill.com";
  const opacity = props.opacity !== undefined ? props.opacity : 0.06;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 5,
        userSelect: "none"
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: "rotate(-30deg)",
          display: "flex",
          flexDirection: "column",
          gap: 80,
          opacity: opacity
        }}
      >
        {[...Array(12)].map((_, row) => (
          <div
            key={row}
            style={{
              display: "flex",
              gap: 60,
              whiteSpace: "nowrap",
              marginInlineStart: row % 2 === 0 ? 0 : 100
            }}
          >
            {[...Array(8)].map((_, col) => (
              <span
                key={col}
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: "var(--pr)",
                  fontFamily: "Source Serif 4, Georgia, serif",
                  letterSpacing: 2
                }}
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
