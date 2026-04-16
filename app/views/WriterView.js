"use client";
import { useState } from "react";

export default function WriterView({
  darkMode, rtl, user, credits, onCreditsChange, showToast, t, TH, CONSTANTS
}) {
  var [topic, setTopic] = useState("");
  var [language, setLanguage] = useState("English");
  var [mood, setMood] = useState("Professional");
  var [era, setEra] = useState("2024");
  var [wordCount, setWordCount] = useState(1000);
  var [gender, setGender] = useState("neutral");
  var [activeTool, setActiveTool] = useState("generate");
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState("");
  var [pasteText, setPasteText] = useState("");

  var TOOLS = [
    { id: "generate", icon: "✍️", cost: 5 },
    { id: "roast", icon: "🔥", cost: 2 },
    { id: "viral", icon: "📊", cost: 2 },
    { id: "remix", icon: "🔄", cost: 3 },
    { id: "debate", icon: "💬", cost: 6 },
    { id: "summary", icon: "📝", cost: 1 },
    { id: "titles", icon: "💡", cost: 1 },
    { id: "thread", icon: "🧵", cost: 2 },
    { id: "linkedin", icon: "💼", cost: 2 },
    { id: "repurpose", icon: "♻️", cost: 5 },
  ];

  var LANGUAGES = (CONSTANTS && CONSTANTS.LANGUAGES) || [
    "English","Arabic","Spanish","French","German","Italian","Portuguese",
    "Russian","Chinese","Japanese","Korean","Hindi","Turkish","Dutch",
    "Swedish","Polish","Czech","Greek","Hebrew","Thai","Vietnamese",
    "Indonesian","Malay","Filipino","Swahili","Persian","Urdu","Bengali"
  ];

  var MOODS = (CONSTANTS && CONSTANTS.MOODS) || [
    { id: "Professional", emoji: "💼" },
    { id: "Casual", emoji: "😎" },
    { id: "Academic", emoji: "🎓" },
    { id: "Creative", emoji: "🎨" },
    { id: "Humorous", emoji: "😂" },
    { id: "Inspirational", emoji: "✨" },
  ];

  var ERAS = (CONSTANTS && CONSTANTS.ERAS) || [
    "1900","1905","1910","1915","1920","1925","1930","1935","1940","1945",
    "1950","1955","1960","1965","1970","1975","1980","1985","1990","1995",
    "2000","2005","2010","2015","2020","2024","2025","2030","2035","2040","2050"
  ];

  var needsPaste = ["roast","viral","remix","summary","titles","thread","linkedin","repurpose"];
  var showPaste = needsPaste.indexOf(activeTool) !== -1;

  function getToolCost() {
    var tool = TOOLS.find(function (tl) { return tl.id === activeTool; });
    return tool ? tool.cost : 5;
  }

  function buildPrompt() {
    var base = "";
    var genderNote = gender === "male"
      ? " Write in a masculine voice/perspective."
      : gender === "female"
        ? " Write in a feminine voice/perspective."
        : "";

    switch (activeTool) {
      case "generate":
        base = "Write a " + wordCount + "-word article about: " + topic +
          ". Language: " + language + ". Tone: " + mood +
          ". Write as if in the year " + era + "." + genderNote;
        break;
      case "roast":
        base = "Roast this article with brutal but funny humor. Be savage but constructive. Article:\n" + pasteText;
        break;
      case "viral":
        base = "Analyze this content for viral potential. Give a score 1-100 and detailed feedback:\n" + pasteText;
        break;
      case "remix":
        base = "Remix this article into a completely different style while keeping the core message. Target style: " + mood + ":\n" + pasteText;
        break;
      case "debate":
        base = "Create a structured debate about: " + topic + ". Present strong arguments for BOTH sides with evidence.";
        break;
      case "summary":
        base = "Summarize this article in 3 bullet points and a one-line TL;DR:\n" + pasteText;
        break;
      case "titles":
        base = "Generate 10 creative, click-worthy titles for this content:\n" + (pasteText || topic);
        break;
      case "thread":
        base = "Convert this into a Twitter/X thread (8-12 tweets). Make it engaging:\n" + pasteText;
        break;
      case "linkedin":
        base = "Convert this into a professional LinkedIn post with hooks and storytelling:\n" + pasteText;
        break;
      case "repurpose":
        base = "Repurpose this content into 5 formats: blog post, social media, email newsletter, video script, podcast outline:\n" + pasteText;
        break;
      default:
        base = "Write about: " + topic;
    }
    return base;
  }

  async function handleGenerate() {
    var cost = getToolCost();
    if (credits < cost) {
      showToast(rtl ? "رصيدك مش كافي" : "Not enough credits", "error");
      return;
    }
    if (activeTool === "generate" && !topic.trim()) {
      showToast(rtl ? "اكتب موضوع" : "Enter a topic", "error");
      return;
    }
    if (showPaste && !pasteText.trim() && activeTool !== "titles") {
      showToast(rtl ? "الصق المحتوى" : "Paste your content", "error");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      var resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
      var data = await resp.json();
      if (data.content) {
        setResult(data.content);
        onCreditsChange(-cost);
        showToast(
          (rtl ? "تم! -" : "Done! -") + cost + (rtl ? " كريديت" : " credits"),
          "success"
        );
      } else {
        showToast(data.error || "Error", "error");
      }
    } catch (err) {
      showToast(rtl ? "خطأ في الاتصال" : "Connection error", "error");
    }
    setLoading(false);
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    showToast(rtl ? "تم النسخ!" : "Copied!", "success");
  }

  var chipStyle = function (active) {
    return {
      padding: "8px 16px",
      borderRadius: "20px",
      border: active ? "2px solid #5B6CF0" : "1px solid " + TH.border,
      background: active ? "rgba(91,108,240,0.12)" : TH.card,
      color: active ? "#5B6CF0" : TH.textSec,
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: active ? 700 : 500,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    };
  };

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <h1 style={{
        fontFamily: "'Source Serif 4', serif",
        fontSize: "1.6rem",
        fontWeight: 700,
        color: TH.text,
        marginBottom: "24px",
        textAlign: "center",
      }}>
        {rtl ? "✍️ كاتب AI الخارق" : "✍️ AI Superwriter"}
      </h1>

      <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "24px",
      }}>
        {TOOLS.map(function (tl) {
          return (
            <button key={tl.id}
              onClick={function () { setActiveTool(tl.id); setResult(""); }}
              style={chipStyle(activeTool === tl.id)}
            >
              {tl.icon} {t("tool_" + tl.id) || tl.id} ({tl.cost})
            </button>
          );
        })}
      </div>

      {(activeTool === "generate" || activeTool === "debate" || activeTool === "titles") && (
        <input
          value={topic}
          onChange={function (e) { setTopic(e.target.value); }}
          placeholder={rtl ? "اكتب الموضوع هنا..." : "Enter your topic..."}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid " + TH.border,
            background: TH.card,
            color: TH.text,
            fontSize: "1rem",
            marginBottom: "16px",
            boxSizing: "border-box",
            direction: rtl ? "rtl" : "ltr",
          }}
        />
      )}

      {showPaste && (
        <textarea
          value={pasteText}
          onChange={function (e) { setPasteText(e.target.value); }}
          placeholder={rtl ? "الصق المحتوى هنا..." : "Paste your content here..."}
          rows={6}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid " + TH.border,
            background: TH.card,
            color: TH.text,
            fontSize: "0.95rem",
            marginBottom: "16px",
            resize: "vertical",
            boxSizing: "border-box",
            direction: rtl ? "rtl" : "ltr",
          }}
        />
      )}

      {activeTool === "generate" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}>
          <div>
            <label style={{ color: TH.textSec, fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              {rtl ? "اللغة" : "Language"}
            </label>
            <select value={language} onChange={function (e) { setLanguage(e.target.value); }} style={{
              width: "100%", padding: "10px", borderRadius: "10px",
              border: "1px solid " + TH.border, background: TH.card,
              color: TH.text, fontSize: "0.9rem",
            }}>
              {LANGUAGES.map(function (l) {
                return <option key={l} value={l}>{l}</option>;
              })}
            </select>
          </div>

          <div>
            <label style={{ color: TH.textSec, fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              {rtl ? "النبرة" : "Mood"}
            </label>
            <select value={mood} onChange={function (e) { setMood(e.target.value); }} style={{
              width: "100%", padding: "10px", borderRadius: "10px",
              border: "1px solid " + TH.border, background: TH.card,
              color: TH.text, fontSize: "0.9rem",
            }}>
              {MOODS.map(function (m) {
                return <option key={m.id} value={m.id}>{m.emoji} {m.id}</option>;
              })}
            </select>
          </div>

          <div>
            <label style={{ color: TH.textSec, fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              {rtl ? "⏳ آلة الزمن" : "⏳ Time Machine"}
            </label>
            <select value={era} onChange={function (e) { setEra(e.target.value); }} style={{
              width: "100%", padding: "10px", borderRadius: "10px",
              border: "1px solid " + TH.border, background: TH.card,
              color: TH.text, fontSize: "0.9rem",
            }}>
              {ERAS.map(function (e) {
                return <option key={e} value={e}>{e}</option>;
              })}
            </select>
          </div>

          <div>
            <label style={{ color: TH.textSec, fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              {rtl ? "عدد الكلمات" : "Words"}: {wordCount}
            </label>
            <input type="range" min={200} max={5000} step={100}
              value={wordCount}
              onChange={function (e) { setWordCount(Number(e.target.value)); }}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ color: TH.textSec, fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              {rtl ? "الجنس" : "Gender"}
            </label>
            <select value={gender} onChange={function (e) { setGender(e.target.value); }} style={{
              width: "100%", padding: "10px", borderRadius: "10px",
              border: "1px solid " + TH.border, background: TH.card,
              color: TH.text, fontSize: "0.9rem",
            }}>
              <option value="neutral">{rtl ? "محايد" : "Neutral"}</option>
              <option value="male">{rtl ? "ذكر" : "Male"}</option>
              <option value="female">{rtl ? "أنثى" : "Female"}</option>
            </select>
          </div>
        </div>
      )}

      <button onClick={handleGenerate} disabled={loading} style={{
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "none",
        background: loading ? TH.border : "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
        color: "#fff",
        fontSize: "1.05rem",
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
        marginBottom: "20px",
        transition: "all 0.25s",
      }}>
        {loading
          ? (rtl ? "⏳ جاري التوليد..." : "⏳ Generating...")
          : (rtl ? "🚀 ولّد (" + getToolCost() + " كريديت)" : "🚀 Generate (" + getToolCost() + " credits)")
        }
      </button>

      {result && (
        <div style={{
          background: TH.card,
          border: "1px solid " + TH.border,
          borderRadius: "16px",
          padding: "24px",
          marginTop: "12px",
          position: "relative",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}>
            <span style={{ fontWeight: 700, color: TH.text }}>
              {rtl ? "النتيجة" : "Result"}
            </span>
            <button onClick={copyResult} style={{
              background: "rgba(91,108,240,0.1)",
              border: "1px solid #5B6CF0",
              color: "#5B6CF0",
              padding: "6px 16px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}>
              {rtl ? "📋 نسخ" : "📋 Copy"}
            </button>
          </div>
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
