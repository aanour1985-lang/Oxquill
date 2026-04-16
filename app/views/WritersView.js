"use client";
import { useState, useEffect } from "react";

export default function WritersView({
  darkMode, rtl, user, showToast, t, TH, db
}) {
  var [writers, setWriters] = useState([]);
  var [search, setSearch] = useState("");

  var DEMO_WRITERS = [
    { name: "Sarah Ahmed", nameAr: "سارة أحمد", specialty: "Tech & AI", specialtyAr: "تقنية وذكاء اصطناعي", articles: 124, rating: 4.9, avatar: "S", languages: ["English", "Arabic"] },
    { name: "Mohamed Ali", nameAr: "محمد علي", specialty: "Business & Finance", specialtyAr: "أعمال ومالية", articles: 89, rating: 4.7, avatar: "M", languages: ["English", "Arabic", "French"] },
    { name: "Layla Hassan", nameAr: "ليلى حسن", specialty: "Creative Writing", specialtyAr: "كتابة إبداعية", articles: 156, rating: 4.8, avatar: "L", languages: ["English", "Arabic"] },
    { name: "Omar Nour", nameAr: "عمر نور", specialty: "Marketing & SEO", specialtyAr: "تسويق وSEO", articles: 203, rating: 4.9, avatar: "O", languages: ["English", "Arabic", "Spanish"] },
  ];

  useEffect(function () {
    if (db) {
      db.getWriters().then(function (w) {
        if (w && w.length) setWriters(w);
        else setWriters(DEMO_WRITERS);
      });
    } else {
      setWriters(DEMO_WRITERS);
    }
  }, []);

  var filtered = (writers.length ? writers : DEMO_WRITERS).filter(function (w) {
    if (!search) return true;
    var s = search.toLowerCase();
    return (w.name && w.name.toLowerCase().indexOf(s) !== -1)
      || (w.nameAr && w.nameAr.indexOf(s) !== -1)
      || (w.specialty && w.specialty.toLowerCase().indexOf(s) !== -1);
  });

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "800px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: TH.text,
        }}>
          👥 {rtl ? "دليل الكتّاب" : "Writers Directory"}
        </h1>
        <p style={{ color: TH.textSec, fontSize: "0.9rem", marginTop: "8px" }}>
          {rtl ? "اكتشف أفضل الكتّاب وتعلم منهم" : "Discover top writers and learn from them"}
        </p>
      </div>

      <input
        value={search}
        onChange={function (e) { setSearch(e.target.value); }}
        placeholder={rtl ? "ابحث عن كاتب..." : "Search writers..."}
        style={{
          width: "100%",
          padding: "12px 18px",
          borderRadius: "12px",
          border: "1px solid " + TH.border,
          background: TH.card,
          color: TH.text,
          fontSize: "0.95rem",
          marginBottom: "24px",
          boxSizing: "border-box",
          direction: rtl ? "rtl" : "ltr",
        }}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px",
      }}>
        {filtered.map(function (w, i) {
          return (
            <div key={i} style={{
              background: TH.card,
              border: "1px solid " + TH.border,
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              transition: "all 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={function (e) {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(91,108,240,0.1)";
            }}
            onMouseLeave={function (e) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{
                width: "60px", height: "60px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#fff",
              }}>
                {w.avatar || (w.name ? w.name.charAt(0) : "?")}
              </div>

              <div style={{ fontWeight: 700, color: TH.text, fontSize: "1rem", marginBottom: "4px" }}>
                {rtl ? (w.nameAr || w.name) : w.name}
              </div>
              <div style={{ color: "#5B6CF0", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                {rtl ? (w.specialtyAr || w.specialty) : w.specialty}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "8px",
              }}>
                <span style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                  📄 {w.articles} {rtl ? "مقال" : "articles"}
                </span>
                <span style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                  ⭐ {w.rating}
                </span>
              </div>

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "4px",
              }}>
                {(w.languages || []).map(function (lang, j) {
                  return (
                    <span key={j} style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                      color: TH.textSec,
                      fontSize: "0.7rem",
                    }}>{lang}</span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
