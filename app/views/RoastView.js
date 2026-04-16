"use client";
import { useState } from "react";

export default function RoastView({
  darkMode, rtl, credits, onCreditsChange, showToast, t, TH
}) {
  var [text, setText] = useState("");
  var [roastLevel, setRoastLevel] = useState("medium");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState("");

  var COST = 2;

  var levels = [
    { id: "gentle", emoji: "😏", en: "Gentle Nudge", ar: "نقد خفيف" },
    { id: "medium", emoji: "🔥", en: "Medium Roast", ar: "نقد متوسط" },
    { id: "savage", emoji: "💀", en: "Savage Mode", ar: "الوضع الوحشي" },
  ];

  async function handleRoast() {
    if (credits < COST) {
      showToast(rtl ? "رصيدك مش كافي" : "Not enough credits", "error");
      return;
    }
    if (!text.trim()) {
      showToast(rtl ? "الصق مقالك الأول" : "Paste your article first", "error");
      return;
    }

    setLoading(true);
    setResult("");
    var levelPrompt = roastLevel === "gentle"
      ? "Be constructive and encouraging with light humor."
      : roastLevel === "savage"
        ? "Be absolutely BRUTAL and merciless (but still constructive underneath the savagery)."
        : "Balance humor with genuine constructive feedback.";

    try {
      var resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "You are a brutally honest but hilarious writing critic. " +
            levelPrompt +
            " Roast this article. Give it a score out of 10. " +
            "Point out weaknesses, cliches, and cringe. " +
            "End with 3 actual tips to improve it.\n\nArticle:\n" + text
        }),
      });
      var data = await resp.json();
      if (data.content) {
        setResult(data.content);
        onCreditsChange(-COST);
        showToast(rtl ? "🔥 تم التحميص!" : "🔥 Roasted!", "success");
      } else {
        showToast(data.error || "Error", "error");
      }
    } catch (err) {
      showToast(rtl ? "خطأ في الاتصال" : "Connection error", "error");
    }
    setLoading(false);
  }

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "700px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🔥</div>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.8rem",
          fontWeight: 800,
          color: TH.text,
          marginBottom: "8px",
        }}>
          {rtl ? "محمصة المقالات" : "The Article Roaster"}
        </h1>
        <p style={{ color: TH.textSec, fontSize: "0.95rem" }}>
          {rtl
            ? "ارمي مقالك هنا وشوف الحقيقة المرة 🔥"
            : "Drop your article and face the brutal truth 🔥"}
        </p>
      </div>

      <div style={{
        display: "flex", gap: "10px",
        justifyContent: "center",
        marginBottom: "20px",
      }}>
        {levels.map(function (lv) {
          var active = roastLevel === lv.id;
          return (
            <button key={lv.id}
              onClick={function () { setRoastLevel(lv.id); }}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                border: active ? "2px solid #EF4444" : "1px solid " + TH.border,
                background: active ? "rgba(239,68,68,0.1)" : TH.card,
                color: active ? "#EF4444" : TH.textSec,
                fontWeight: active ? 700 : 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}>
              {lv.emoji} {rtl ? lv.ar : lv.en}
            </button>
          );
        })}
      </div>

      <textarea
        value={text}
        onChange={function (e) { setText(e.target.value); }}
        placeholder={rtl
          ? "الصق مقالك هنا... (الأطول = التحميص أمتع)"
          : "Paste your article here... (longer = more fun roast)"}
        rows={10}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "14px",
          border: "1px solid " + TH.border,
          background: TH.card,
          color: TH.text,
          fontSize: "0.95rem",
          resize: "vertical",
          boxSizing: "border-box",
          direction: rtl ? "rtl" : "ltr",
          lineHeight: 1.7,
        }}
      />

      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", margin: "12px 0 20px",
      }}>
        <span style={{ color: TH.textSec, fontSize: "0.85rem" }}>
          {text.split(/\s+/).filter(Boolean).length} {rtl ? "كلمة" : "words"}
        </span>
        <span style={{ color: TH.textSec, fontSize: "0.85rem" }}>
          {COST} {rtl ? "كريديت" : "credits"}
        </span>
      </div>

      <button onClick={handleRoast} disabled={loading} style={{
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "none",
        background: loading ? TH.border : "linear-gradient(135deg, #EF4444, #F97316)",
        color: "#fff",
        fontSize: "1.1rem",
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.25s",
      }}>
        {loading
          ? (rtl ? "🔥 جاري التحميص..." : "🔥 Roasting...")
          : (rtl ? "🔥 حمّص مقالي!" : "🔥 Roast My Article!")}
      </button>

      {result && (
        <div style={{
          background: TH.card,
          border: "1px solid " + TH.border,
          borderRadius: "16px",
          padding: "24px",
          marginTop: "24px",
        }}>
          <h3 style={{
            color: "#EF4444",
            fontWeight: 700,
            marginBottom: "16px",
            fontSize: "1.1rem",
          }}>
            🔥 {rtl ? "نتيجة التحميص" : "Roast Results"}
          </h3>
          <div style={{
            color: TH.text,
            fontSize: "0.95rem",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            direction: rtl ? "rtl" : "ltr",
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
