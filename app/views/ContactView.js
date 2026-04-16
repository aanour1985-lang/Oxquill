"use client";
import { useState } from "react";

export default function ContactView({
  darkMode, rtl, user, showToast, t, TH, db
}) {
  var [type, setType] = useState("suggestion");
  var [subject, setSubject] = useState("");
  var [message, setMessage] = useState("");
  var [email, setEmail] = useState((user && user.email) || "");
  var [sending, setSending] = useState(false);

  var TYPES = [
    { id: "suggestion", emoji: "💡", en: "Suggestion", ar: "اقتراح" },
    { id: "question", emoji: "❓", en: "Question", ar: "سؤال" },
    { id: "complaint", emoji: "😤", en: "Complaint", ar: "شكوى" },
    { id: "collaboration", emoji: "🤝", en: "Collaboration", ar: "تعاون" },
    { id: "business", emoji: "💼", en: "Business", ar: "تجاري" },
    { id: "technical", emoji: "🔧", en: "Technical", ar: "تقني" },
  ];

  async function handleSubmit() {
    if (!subject.trim() || !message.trim()) {
      showToast(rtl ? "اكتب الموضوع والرسالة" : "Enter subject and message", "error");
      return;
    }
    if (!email.trim()) {
      showToast(rtl ? "اكتب بريدك" : "Enter your email", "error");
      return;
    }

    setSending(true);
    try {
      if (db) {
        await db.createMessage({
          type: type,
          subject: subject,
          message: message,
          email: email,
          user_id: user ? user.id : null,
          status: "new",
          created_at: new Date().toISOString(),
        });
      }
      showToast(rtl ? "تم إرسال رسالتك! 📩" : "Message sent! 📩", "success");
      setSubject("");
      setMessage("");
    } catch (e) {
      showToast(rtl ? "خطأ في الإرسال" : "Send error", "error");
    }
    setSending(false);
  }

  var inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid " + TH.border,
    background: TH.card,
    color: TH.text,
    fontSize: "0.95rem",
    boxSizing: "border-box",
    direction: rtl ? "rtl" : "ltr",
  };

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📩</div>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: TH.text,
        }}>
          {rtl ? "تواصل معنا" : "Contact Us"}
        </h1>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
        marginBottom: "24px",
      }}>
        {TYPES.map(function (tp) {
          var active = type === tp.id;
          return (
            <button key={tp.id}
              onClick={function () { setType(tp.id); }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: active ? "2px solid #5B6CF0" : "1px solid " + TH.border,
                background: active ? "rgba(91,108,240,0.1)" : "transparent",
                color: active ? "#5B6CF0" : TH.textSec,
                fontWeight: active ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}>
              {tp.emoji} {rtl ? tp.ar : tp.en}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <input
          value={email}
          onChange={function (e) { setEmail(e.target.value); }}
          placeholder={rtl ? "بريدك الإلكتروني" : "Your email"}
          type="email"
          style={inputStyle}
        />
        <input
          value={subject}
          onChange={function (e) { setSubject(e.target.value); }}
          placeholder={rtl ? "الموضوع" : "Subject"}
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={function (e) { setMessage(e.target.value); }}
          placeholder={rtl ? "اكتب رسالتك..." : "Your message..."}
          rows={6}
          style={Object.assign({}, inputStyle, { resize: "vertical" })}
        />

        <button onClick={handleSubmit} disabled={sending} style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          background: sending ? TH.border : "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: sending ? "wait" : "pointer",
        }}>
          {sending
            ? (rtl ? "جاري الإرسال..." : "Sending...")
            : (rtl ? "📩 أرسل" : "📩 Send")}
        </button>
      </div>
    </div>
  );
}
