// ═══════════════════════════════════════════════════════════════════
// THEME TOKENS — Light & Dark modes
// Use: import { LIGHT, DARK, getTheme } from "./theme"
// ═══════════════════════════════════════════════════════════════════

// ─── LIGHT MODE (Day) ─────────────────────────────────────
export const LIGHT = {
  bg: "#F7F8FC",        // Page background
  cd: "#FFFFFF",        // Card / Modal background
  b3: "#EEF0F7",        // Subtle background (chip, sidebar item)
  tx: "#1A1F36",        // Primary text
  t2: "#4A5070",        // Secondary text
  t3: "#8C92AB",        // Tertiary text (hints, placeholders)
  pr: "#5B6CF0",        // Primary brand color
  p2: "#9B7BF0",        // Secondary brand color
  pS: "rgba(91,108,240,.08)",  // Primary soft (badge bg)
  bd: "#E4E8F1",        // Border
  nv: "rgba(247,248,252,.94)", // Nav background (with blur)
  ok: "#2D8A4E",        // Success
  er: "#D4453C",        // Error
  wr: "#EFA935",        // Warning
  sh: "rgba(91,108,240,.12)",
  sh2: "rgba(0,0,0,.06)",
  overlay: "rgba(0,0,0,.45)"
};

// ─── DARK MODE (Night) ────────────────────────────────────
export const DARK = {
  bg: "#0F1018",
  cd: "#1A1B26",
  b3: "#252630",
  tx: "#E8E6F0",
  t2: "#A0A0B8",
  t3: "#6A6A82",
  pr: "#7B8AF5",
  p2: "#B89FF5",
  pS: "rgba(123,138,245,.14)",
  bd: "#2A2B38",
  nv: "rgba(15,16,24,.92)",
  ok: "#3BBF85",
  er: "#EF7B6C",
  wr: "#EFA935",
  sh: "rgba(123,138,245,.2)",
  sh2: "rgba(0,0,0,.3)",
  overlay: "rgba(0,0,0,.6)"
};

// ─── HELPER: Get current theme based on dark flag ─────────
export function getTheme(dark) {
  return dark ? DARK : LIGHT;
}

// ─── HELPER: Build CSS variables string ───────────────────
export function buildCssVars(theme, rtl) {
  let vars = "";
  const keys = Object.keys(theme);
  for (let i = 0; i < keys.length; i++) {
    vars += "--" + keys[i] + ":" + theme[keys[i]] + ";";
  }
  vars += "min-height:100vh;";
  vars += "background:var(--bg);";
  vars += "font-family:Plus Jakarta Sans,system-ui,sans-serif;";
  vars += "color:var(--tx);";
  vars += "overflow-x:hidden;";
  vars += "direction:" + (rtl ? "rtl" : "ltr") + ";";
  return vars;
}
