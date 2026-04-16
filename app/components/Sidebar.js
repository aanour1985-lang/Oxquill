// ═══════════════════════════════════════════════════════════════════
// SIDEBAR — Reorganized navigation with Profile at top
// Props: open, setOpen, view, go, t, rtl, profile, authUser, isAdmin, credits, gender
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

function SideItem(props) {
  const [hover, setHover] = useState(false);
  const active = props.active;

  return (
    <div
      onClick={props.onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: props.sub ? "9px 18px 9px 34px" : "11px 18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 11,
        background: active ? "var(--pS)" : hover ? "var(--b3)" : "transparent",
        color: active ? "var(--pr)" : "var(--t2)",
        fontSize: props.sub ? 12 : 13,
        fontWeight: props.sub ? 500 : 600,
        borderInlineStart: active ? "3px solid var(--pr)" : "3px solid transparent",
        transition: "background 0.18s, color 0.18s, border-color 0.18s",
        userSelect: "none"
      }}
    >
      <span style={{ fontSize: props.sub ? 11 : 13, fontWeight: 700, color: active ? "var(--pr)" : "var(--t3)" }}>
        {props.ic}
      </span>
      <span style={{ flex: 1 }}>{props.label}</span>
      {props.badge !== undefined && props.badge > 0 && (
        <span
          style={{
            background: "var(--er)",
            color: "#fff",
            borderRadius: 99,
            padding: "1px 7px",
            fontSize: 9,
            fontWeight: 800,
            minWidth: 18,
            textAlign: "center"
          }}
        >
          {props.badge}
        </span>
      )}
    </div>
  );
}

function SectionHeader({ label, collapsible, open, onToggle }) {
  return (
    <div
      onClick={collapsible ? onToggle : undefined}
      style={{
        padding: "12px 18px 6px",
        cursor: collapsible ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "var(--t3)",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        userSelect: "none"
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {collapsible && (
        <span style={{ fontSize: 9, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--bd)", margin: "8px 18px" }} />;
}

export default function Sidebar(props) {
  const { open, setOpen, view, go, t, rtl, profile, authUser, isAdmin, credits, gender } = props;
  const [servicesOpen, setServicesOpen] = useState(true);

  if (!open) return null;

  function greeting() {
    if (!profile) return "";
    const name = profile.name || "";
    if (rtl) {
      if (gender === "male") return "أهلاً بك، " + name;
      if (gender === "female") return "أهلاً بكِ، " + name;
      return "أهلاً، " + name;
    }
    return "Welcome, " + name;
  }

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          background: "rgba(0,0,0,.4)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          animation: "fadeIn 0.2s"
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          insetInlineStart: 0,
          bottom: 0,
          zIndex: 200,
          width: "min(290px, 85vw)",
          background: "var(--cd)",
          borderInlineEnd: "1px solid var(--bd)",
          overflowY: "auto",
          animation: "slideInSide 0.25s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 20px 60px rgba(0,0,0,.15)"
        }}
      >
        {authUser && profile ? (
          <div
            style={{
              padding: 18,
              borderBottom: "1px solid var(--bd)",
              background: "linear-gradient(135deg, var(--pS), transparent)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--pr), var(--p2))",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: 17,
                  flexShrink: 0
                }}
              >
                {(profile.name || "U")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tx)" }}>
                  {greeting()}
                </div>
                <div style={{ fontSize: 10, color: "var(--t3)", wordBreak: "break-all" }}>
                  {profile.email}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--pr)",
                  color: "#fff"
                }}
              >
                C {credits}
              </span>
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--b3)",
                  color: "var(--t2)"
                }}
              >
                {(profile.plan || "free").toUpperCase()}
              </span>
              {isAdmin && (
                <span
                  style={{
                    padding: "3px 9px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    background: "var(--wr)",
                    color: "#fff"
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--bd)", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg, var(--pr), var(--p2))",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 13,
                color: "#fff"
              }}
            >
              Ox
            </div>
            <div>
              <div style={{ fontFamily: "Source Serif 4, Georgia, serif", fontSize: 17, fontWeight: 900, color: "var(--tx)" }}>
                {t("brand")}
              </div>
              <div style={{ fontSize: 9, color: "var(--t3)" }}>{t("tagline")}</div>
            </div>
          </div>
        )}

        <div style={{ padding: "10px 0" }}>
          <SideItem ic="H" label={t("nav.home")} active={view === "landing"} onClick={() => go("landing")} />

          {authUser && (
            <>
              <SectionHeader label={t("sidebar.profile")} />
              <SideItem ic="P" label={t("nav.profile")} active={view === "profile"} onClick={() => go("profile")} />
              <SideItem ic="A" label={t("nav.articles")} active={view === "profile-articles"} onClick={() => go("profile-articles")} />
              <Divider />
            </>
          )}

          <SectionHeader
            label={t("sidebar.services")}
            collapsible={true}
            open={servicesOpen}
            onToggle={() => setServicesOpen(!servicesOpen)}
          />
          {servicesOpen && (
            <>
              <SideItem ic="W" label={t("nav.writer")} active={view === "writer"} onClick={() => go("writer")} sub />
              <SideItem ic="B" label={t("nav.battle")} active={view === "battle"} onClick={() => go("battle")} sub />
              <SideItem ic="R" label={t("nav.roast")} active={view === "roast"} onClick={() => go("roast")} sub />
              <SideItem ic="D" label={t("nav.writers")} active={view === "writers"} onClick={() => go("writers")} sub />
            </>
          )}

          <Divider />

          <SectionHeader label={t("sidebar.billing")} />
          <SideItem ic="$" label={t("nav.credits")} active={view === "credits"} onClick={() => go("credits")} />
          <SideItem ic="*" label={t("nav.pricing")} active={view === "pricing"} onClick={() => go("pricing")} />

          <Divider />

          <SectionHeader label={t("sidebar.support")} />
          <SideItem ic="@" label={t("nav.contact")} active={view === "contact"} onClick={() => go("contact")} />
          <SideItem ic="T" label={t("nav.terms")} active={view === "terms"} onClick={() => go("terms")} />
          <SideItem ic="K" label={t("nav.privacy")} active={view === "privacy"} onClick={() => go("privacy")} />

          {isAdmin && (
            <>
              <Divider />
              <SectionHeader label="ADMIN" />
              <SideItem ic="!" label={t("nav.admin")} active={view === "admin"} onClick={() => go("admin")} badge={props.newMessagesCount} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
