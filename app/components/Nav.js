// ═══════════════════════════════════════════════════════════════════
// NAV — Top navigation bar with animations
// Props: rtl, dark, setDark, setRtl, authUser, credits, onMenu, onLogin, onLogout, onHome, t
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

function NavButton({ onClick, children, style, ariaLabel }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: hover ? "var(--pS)" : "var(--b3)",
        border: "1px solid " + (hover ? "var(--pr)" : "var(--bd)"),
        borderRadius: 8,
        cursor: "pointer",
        color: hover ? "var(--pr)" : "var(--t2)",
        fontFamily: "inherit",
        transform: pressed ? "scale(0.92)" : hover ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s, border 0.2s",
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style
      }}
    >
      {children}
    </button>
  );
}

function LoginButton({ onClick, children, primary }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = primary
    ? (hover ? "#4A5BE0" : "var(--pr)")
    : (hover ? "var(--b3)" : "var(--cd)");
  const color = primary ? "#fff" : "var(--tx)";
  const border = primary
    ? "none"
    : "1px solid " + (hover ? "var(--pr)" : "var(--bd)");

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        padding: "7px 16px",
        background: bg,
        color: color,
        border: border,
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        transform: pressed ? "scale(0.95)" : hover ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s, border 0.2s",
        boxShadow: primary && hover ? "0 6px 18px var(--sh)" : "none",
        outline: "none"
      }}
    >
      {children}
    </button>
  );
}

function CreditsBadge({ credits, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "5px 12px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 800,
        background: "linear-gradient(135deg, var(--wr), #EF7B6C)",
        color: "#fff",
        cursor: "pointer",
        border: "none",
        height: 32,
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "inherit",
        transform: hover ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.2s",
        boxShadow: hover ? "0 6px 18px rgba(239,169,53,.4)" : "0 2px 8px rgba(239,169,53,.25)",
        outline: "none"
      }}
    >
      C {credits}
    </button>
  );
}

function LogoButton({ onClick, t, hover, setHover }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
        fontFamily: "inherit",
        transform: hover ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.2s cubic-bezier(.4,0,.2,1)",
        outline: "none"
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, var(--pr), var(--p2))",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 12,
          color: "#fff",
          letterSpacing: -0.5,
          boxShadow: hover ? "0 6px 18px var(--sh)" : "0 2px 6px var(--sh)",
          transition: "box-shadow 0.2s"
        }}
      >
        Ox
      </div>
      <div style={{ textAlign: "start" }}>
        <div
          style={{
            fontFamily: "Source Serif 4, Georgia, serif",
            fontSize: 16,
            fontWeight: 900,
            lineHeight: 1,
            color: "var(--tx)"
          }}
        >
          {t("brand")}
        </div>
        <div style={{ fontSize: 9, color: "var(--t3)", lineHeight: 1, marginTop: 2 }}>
          {t("tagline")}
        </div>
      </div>
    </button>
  );
}

export default function Nav(props) {
  const [logoHover, setLogoHover] = useState(false);
  const { rtl, dark, setDark, setRtl, authUser, credits, onMenu, onLogin, onLogout, onHome, t } = props;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        zIndex: 100,
        height: 56,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--nv)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--bd)",
        transition: "background 0.3s, border-color 0.3s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NavButton
          onClick={onMenu}
          ariaLabel="Menu"
          style={{ width: 34, height: 34, fontSize: 18, fontWeight: 900 }}
        >
          ☰
        </NavButton>
        <LogoButton onClick={onHome} t={t} hover={logoHover} setHover={setLogoHover} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <NavButton
          onClick={() => setDark(!dark)}
          ariaLabel={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{ width: 34, height: 32, fontSize: 14 }}
        >
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </NavButton>
        <NavButton
          onClick={() => setRtl(!rtl)}
          ariaLabel="Switch language"
          style={{ minWidth: 42, height: 32, fontSize: 10, fontWeight: 800 }}
        >
          {rtl ? "EN" : "AR"}
        </NavButton>
        {authUser && <CreditsBadge credits={credits} onClick={props.onCredits} />}
        {authUser ? (
          <LoginButton onClick={onLogout}>{t("nav.logout")}</LoginButton>
        ) : (
          <LoginButton onClick={onLogin} primary>{t("nav.login")}</LoginButton>
        )}
      </div>
    </nav>
  );
}
