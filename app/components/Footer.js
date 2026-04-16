// ═══════════════════════════════════════════════════════════════════
// FOOTER — With clear Light/Dark toggle (sun/moon icons) + Language
// Props: t, dark, setDark, rtl, setRtl, go
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

function FooterLink({ onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 12,
        color: hover ? "var(--pr)" : "var(--t2)",
        cursor: "pointer",
        padding: "4px 0",
        display: "block",
        background: "none",
        border: "none",
        textAlign: "start",
        fontFamily: "inherit",
        transition: "color 0.18s",
        outline: "none"
      }}
    >
      {children}
    </button>
  );
}

function ThemeToggle({ dark, setDark, rtl, t }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--b3)",
        borderRadius: 99,
        padding: 4,
        gap: 2,
        border: "1px solid var(--bd)"
      }}
    >
      <button
        onClick={() => setDark(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 99,
          border: "none",
          background: !dark ? "var(--cd)" : "transparent",
          color: !dark ? "var(--wr)" : "var(--t3)",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.2s",
          boxShadow: !dark ? "0 2px 6px rgba(0,0,0,.08)" : "none",
          outline: "none"
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        {t("footer.lightMode")}
      </button>
      <button
        onClick={() => setDark(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 99,
          border: "none",
          background: dark ? "var(--cd)" : "transparent",
          color: dark ? "var(--pr)" : "var(--t3)",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.2s",
          boxShadow: dark ? "0 2px 6px rgba(0,0,0,.15)" : "none",
          outline: "none"
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        {t("footer.darkMode")}
      </button>
    </div>
  );
}

function LanguageToggle({ rtl, setRtl, t }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--b3)",
        borderRadius: 99,
        padding: 4,
        gap: 2,
        border: "1px solid var(--bd)"
      }}
    >
      <button
        onClick={() => setRtl(false)}
        style={{
          padding: "7px 14px",
          borderRadius: 99,
          border: "none",
          background: !rtl ? "var(--cd)" : "transparent",
          color: !rtl ? "var(--pr)" : "var(--t3)",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.2s",
          boxShadow: !rtl ? "0 2px 6px rgba(0,0,0,.08)" : "none",
          outline: "none"
        }}
      >
        EN
      </button>
      <button
        onClick={() => setRtl(true)}
        style={{
          padding: "7px 14px",
          borderRadius: 99,
          border: "none",
          background: rtl ? "var(--cd)" : "transparent",
          color: rtl ? "var(--pr)" : "var(--t3)",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.2s",
          boxShadow: rtl ? "0 2px 6px rgba(0,0,0,.08)" : "none",
          outline: "none"
        }}
      >
        AR
      </button>
    </div>
  );
}

export default function Footer(props) {
  const { t, dark, setDark, rtl, setRtl, go } = props;

  return (
    <footer
      style={{
        borderTop: "1px solid var(--bd)",
        padding: "40px 20px 24px",
        marginTop: 40,
        background: "var(--cd)",
        transition: "background 0.3s"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 26,
            marginBottom: 28
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: "linear-gradient(135deg, var(--pr), var(--p2))",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: 11,
                  color: "#fff"
                }}
              >
                Ox
              </div>
              <div
                style={{
                  fontFamily: "Source Serif 4, Georgia, serif",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--tx)"
                }}
              >
                {t("brand")}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6 }}>
              {t("tagline")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--t3)", marginBottom: 10 }}>
              {t("footer.services")}
            </div>
            <FooterLink onClick={() => go("writer")}>{t("nav.writer")}</FooterLink>
            <FooterLink onClick={() => go("battle")}>{t("nav.battle")}</FooterLink>
            <FooterLink onClick={() => go("roast")}>{t("nav.roast")}</FooterLink>
            <FooterLink onClick={() => go("writers")}>{t("nav.writers")}</FooterLink>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--t3)", marginBottom: 10 }}>
              {t("footer.company")}
            </div>
            <FooterLink onClick={() => go("pricing")}>{t("nav.pricing")}</FooterLink>
            <FooterLink onClick={() => go("credits")}>{t("nav.credits")}</FooterLink>
            <FooterLink onClick={() => go("contact")}>{t("nav.contact")}</FooterLink>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--t3)", marginBottom: 10 }}>
              {t("footer.legal")}
            </div>
            <FooterLink onClick={() => go("terms")}>{t("nav.terms")}</FooterLink>
            <FooterLink onClick={() => go("privacy")}>{t("nav.privacy")}</FooterLink>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--bd)",
            paddingTop: 22,
            paddingBottom: 18,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ThemeToggle dark={dark} setDark={setDark} rtl={rtl} t={t} />
          <LanguageToggle rtl={rtl} setRtl={setRtl} t={t} />
        </div>

        <div
          style={{
            borderTop: "1px solid var(--bd)",
            paddingTop: 18,
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: 11, color: "var(--t3)" }}>
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
