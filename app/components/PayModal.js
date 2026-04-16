// ═══════════════════════════════════════════════════════════════════
// PAY MODAL — Simulated checkout (will be replaced by LemonSqueezy in Phase 2)
// Props: data (type, price, label, credits), onClose, onSuccess, rtl, t
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

export default function PayModal(props) {
  const { data, onClose, onSuccess, rtl, t } = props;
  const [step, setStep] = useState("form");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  function proceed() {
    if (cardNum.replace(/\s/g, "").length < 12 || !expiry || cvc.length < 3 || !name.trim()) return;
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    }, 1500);
  }

  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 13px",
    background: "var(--bg)",
    border: "1.5px solid " + (focusedField === field ? "var(--pr)" : "var(--bd)"),
    borderRadius: 8,
    color: "var(--tx)",
    fontFamily: "inherit",
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxShadow: focusedField === field ? "0 0 0 3px var(--pS)" : "none"
  });

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--t3)",
    marginBottom: 5
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: 16,
        direction: rtl ? "rtl" : "ltr",
        animation: "fadeIn 0.2s"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--overlay)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)"
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "var(--cd)",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
          animation: "modalIn 0.25s cubic-bezier(.4,0,.2,1)"
        }}
      >
        {step === "form" && (
          <>
            <div
              style={{
                fontFamily: "Source Serif 4, Georgia, serif",
                fontSize: 22,
                fontWeight: 900,
                color: "var(--tx)",
                marginBottom: 4
              }}
            >
              {rtl ? "إتمام الدفع" : "Checkout"}
            </div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginBottom: 20 }}>
              {data.label} · ${data.price}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{rtl ? "الاسم على البطاقة" : "Name on Card"}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("name")}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{rtl ? "رقم البطاقة" : "Card Number"}</label>
              <input
                value={cardNum}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const f = v.match(/.{1,4}/g);
                  setCardNum(f ? f.join(" ") : "");
                }}
                onFocus={() => setFocusedField("card")}
                onBlur={() => setFocusedField(null)}
                placeholder="1234 5678 9012 3456"
                style={inputStyle("card")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>MM/YY</label>
                <input
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                    setExpiry(v);
                  }}
                  onFocus={() => setFocusedField("exp")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="12/28"
                  style={inputStyle("exp")}
                />
              </div>
              <div>
                <label style={labelStyle}>CVC</label>
                <input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onFocus={() => setFocusedField("cvc")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="123"
                  style={inputStyle("cvc")}
                />
              </div>
            </div>

            <button
              onClick={proceed}
              style={{
                width: "100%",
                padding: 13,
                background: "var(--pr)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 20px var(--sh)",
                transition: "transform 0.15s, box-shadow 0.2s",
                outline: "none"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {rtl ? "ادفع الآن" : "Pay Now"} ${data.price}
            </button>

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: "var(--t3)" }}>
              {rtl ? "عرض تجريبي — لن يتم خصم مبلغ فعلي" : "Demo mode — no actual charge"}
            </div>
          </>
        )}

        {step === "processing" && (
          <div style={{ textAlign: "center", padding: 30 }}>
            <div
              style={{
                width: 56,
                height: 56,
                border: "4px solid var(--b3)",
                borderTop: "4px solid var(--pr)",
                borderRadius: "50%",
                margin: "0 auto 18px",
                animation: "spin 0.8s linear infinite"
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx)" }}>
              {rtl ? "جاري المعالجة..." : "Processing..."}
            </div>
          </div>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: 30 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "var(--ok)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
                fontSize: 34,
                fontWeight: 900,
                animation: "scaleIn 0.4s cubic-bezier(.4,0,.2,1)"
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: "var(--tx)" }}>
              {rtl ? "تم الدفع بنجاح!" : "Payment Successful"}
            </div>
            <p style={{ fontSize: 12, color: "var(--t2)" }}>
              {rtl ? "جاري تحديث حسابك..." : "Updating your account..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
