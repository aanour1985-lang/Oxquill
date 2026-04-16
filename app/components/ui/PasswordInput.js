// ═══════════════════════════════════════════════════════════════════
// PASSWORD INPUT — With show/hide eye toggle
// Props: value, onChange, placeholder, label, error, hint, rtl
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function PasswordInput(props) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: 5
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 44px 11px 13px",
    background: "var(--bg)",
    border: "1.5px solid " + (props.error ? "var(--er)" : focused ? "var(--pr)" : "var(--bd)"),
    borderRadius: 8,
    color: "var(--tx)",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxShadow: focused ? "0 0 0 3px var(--pS)" : "none"
  };

  const iconPosition = props.rtl
    ? { left: 10 }
    : { right: 10 };

  if (props.rtl) {
    inputStyle.padding = "11px 13px 11px 44px";
  }

  return (
    <div style={{ marginBottom: 12 }}>
      {props.label && <label style={labelStyle}>{props.label}</label>}
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            ...iconPosition,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--t3)",
            transition: "color 0.15s",
            outline: "none"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--pr)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--t3)"; }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {props.error && (
        <div style={{ fontSize: 10, color: "var(--er)", marginTop: 4 }}>
          {props.error}
        </div>
      )}
      {props.hint && !props.error && (
        <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 4 }}>
          {props.hint}
        </div>
      )}
    </div>
  );
}
