"use client";
import { useState } from "react";

export default function BattleView({
  darkMode, rtl, credits, onCreditsChange, showToast, t, TH
}) {
  var [topicA, setTopicA] = useState("");
  var [topicB, setTopicB] = useState("");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState("");
  var COST = 4;

  async function handleBattle() {
    if (credits < COST) {
      showToast(rtl ? "رصيدك مش كافي" : "Not enough credits", "error");
      return;
    }
    if (!topicA.trim() || !topicB.trim()) {
      showToast(rtl ? "اكتب الموضوعين" : "Enter both topics", "error");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      var resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Create an epic debate battle between two positions:\n" +
            "SIDE A: " + topicA + "\nSIDE B: " + topicB +
            "\n\nStructure:\n1. Opening statements (both sides)\n" +
            "2. Three rounds of arguments and rebuttals\n" +
            "3. Final closing arguments\n" +
            "4. Judge's verdict with scoring\n\n" +
            "Make it dramatic, engaging, and well-argued. Use evidence and examples."
        }),
      });
      var data = await resp.json();
      if (data.content) {
        setResult(data.content);
        onCreditsChange(-COST);
        showToast(rtl ? "⚔️ تم!" : "⚔️ Battle complete!", "success");
      } else {
        showToast(data.error || "Error", "error");
      }
    } catch (err) {
      showToast(rtl ? "خطأ في الاتصال" : "Connection error", "error");
    }
    setLoading(false);
  }

  var inputStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid " + TH.border,
    background: TH.card,
    color: TH.text,
    fontSize: "1rem",
    boxSizing: "border-box",
    direction: rtl ? "rtl" : "ltr",
  };

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "700px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "8px" }}>⚔️</div>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.8rem",
          fontWeight: 800,
          color: TH.text,
        }}>
          {rtl ? "ساحة المعركة" : "Battle Arena"}
        </h1>
        <p style={{ color: TH.textSec, fontSize: "0.95rem", marginTop: "8px" }}>
          {rtl ? "حط موضوعين وشوف مين يكسب!" : "Pit two topics against each other!"}
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "12px",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <input value={topicA}
          onChange={function (e) { setTopicA(e.target.value); }}
          placeholder={rtl ? "الطرف الأول..." : "Side A..."}
          style={inputStyle}
        />
        <span style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#EF4444",
        }}>VS</span>
        <input value={topicB}
          onChange={function (e) { setTopicB(e.target.value); }}
          placeholder={rtl ? "الطرف الثاني..." : "Side B..."}
          style={inputStyle}
        />
      </div>

      <button onClick={handleBattle} disabled={loading} style={{
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "none",
        background: loading ? TH.border : "linear-gradient(135deg, #EF4444, #8B5CF6)",
        color: "#fff",
        fontSize: "1.1rem",
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
      }}>
        {loading
          ? (rtl ? "⚔️ المعركة جارية..." : "⚔️ Battle in progress...")
          : (rtl ? "⚔️ ابدأ المعركة! (" + COST + " كريديت)" : "⚔️ Start Battle! (" + COST + " credits)")}
      </button>

      {result && (
        <div style={{
          background: TH.card,
          border: "1px solid " + TH.border,
          borderRadius: "16px",
          padding: "24px",
          marginTop: "24px",
          whiteSpace: "pre-wrap",
          color: TH.text,
          lineHeight: 1.8,
          fontSize: "0.95rem",
          direction: rtl ? "rtl" : "ltr",
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
