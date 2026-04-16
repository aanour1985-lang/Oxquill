"use client";
import { useState, useEffect } from "react";

var LIGHT = { bg: "#FAFAFA", text: "#1A1A2E", textSec: "#6B7280", card: "#FFFFFF", border: "#E5E7EB", primary: "#5B6CF0" };
var DARK = { bg: "#0F0F1A", text: "#F1F1F1", textSec: "#9CA3AF", card: "#1A1A2E", border: "#2D2D44", primary: "#5B6CF0" };

export default function Home() {
  var [darkMode, setDarkMode] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [view, setView] = useState("landing");
  var [showMenu, setShowMenu] = useState(false);
  var [toast, setToast] = useState(null);

  var TH = darkMode ? DARK : LIGHT;

  function navigate(v) { setView(v); setShowMenu(false); window.scrollTo(0, 0); }
  function showToast(m) { setToast(m); setTimeout(function () { setToast(null); }, 2000); }

  return (
    <div style={{ minHeight: "100vh", background: TH.bg, color: TH.text, fontFamily: "system-ui, sans-serif", direction: rtl ? "rtl" : "ltr" }}>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: TH.card, borderBottom: "1px solid " + TH.border, padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={function () { setShowMenu(!showMenu); }} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: TH.text }}>☰</button>
          <span onClick={function () { navigate("landing"); }} style={{ fontWeight: 800, fontSize: "1.2rem", cursor: "pointer", color: TH.text }}>✍️ OxQuill</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={function () { setDarkMode(!darkMode); }} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer" }}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={function () { setRtl(!rtl); }} style={{ background: "none", border: "none", fontSize: "0.8rem", cursor: "pointer", color: TH.textSec, fontWeight: 700 }}>{rtl ? "EN" : "AR"}</button>
        </div>
      </nav>

      {showMenu && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, bottom: 0, zIndex: 99 }}>
          <div onClick={function () { setShowMenu(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "relative", background: TH.card, padding: "8px 0", maxWidth: "280px" }}>
            {[
              { id: "landing", label: "🏠 Home" },
              { id: "writer", label: "✍️ Writer" },
              { id: "roast", label: "🔥 Roast" },
              { id: "battle", label: "⚔️ Battle" },
              { id: "pricing", label: "💎 Pricing" },
              { id: "contact", label: "📩 Contact" },
            ].map(function (item) {
              return (
                <button key={item.id} onClick={function () { navigate(item.id); }} style={{ display: "block", width: "100%", padding: "12px 20px", background: view === item.id ? "rgba(91,108,240,0.1)" : "transparent", border: "none", color: view === item.id ? "#5B6CF0" : TH.text, fontSize: "0.95rem", cursor: "pointer", textAlign: rtl ? "right" : "left" }}>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main style={{ paddingTop: "70px", padding: "70px 16px 40px", maxWidth: "800px", margin: "0 auto" }}>

        {view === "landing" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
              {rtl ? "كل كاتب يستاهل " : "Every Writer Deserves a "}
              <span style={{ color: "#5B6CF0" }}>{rtl ? "عقل خارق" : "Superbrain"}</span>
            </h1>
            <p style={{ color: TH.textSec, marginBottom: "32px" }}>
              {rtl ? "28 لغة. 31 حقبة. صوتك، بأضعاف قوته." : "28 languages. 31 eras. Your voice, amplified."}
            </p>
            <button onClick={function () { navigate("writer"); }} style={{ background: "#5B6CF0", color: "#fff", border: "none", padding: "14px 36px", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>
              {rtl ? "ابدأ الكتابة" : "Start Writing"}
            </button>

            <div style={{ display: "flex", justifyContent: "center", gap: "40px", margin: "40px 0" }}>
              {[{ n: "28", l: "Languages" }, { n: "31", l: "Eras" }, { n: "10", l: "AI Tools" }].map(function (s, i) {
                return <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#5B6CF0" }}>{s.n}</div><div style={{ fontSize: "0.8rem", color: TH.textSec }}>{s.l}</div></div>;
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", margin: "40px 0" }}>
              {[
                { icon: "✍️", name: "AI Writer", link: "writer" },
                { icon: "🔥", name: "Roast", link: "roast" },
                { icon: "⚔️", name: "Battle", link: "battle" },
                { icon: "📊", name: "Viral Score", link: "writer" },
                { icon: "🔄", name: "Remix", link: "writer" },
                { icon: "⏳", name: "Time Machine", link: "writer" },
              ].map(function (f, i) {
                return (
                  <div key={i} onClick={function () { navigate(f.link); }} style={{ background: TH.card, border: "1px solid " + TH.border, borderRadius: "14px", padding: "20px", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{f.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{f.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "writer" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>✍️ AI Superwriter</h1>
            <p style={{ color: TH.textSec }}>Writer view loaded! Full version coming with Wave 2 integration.</p>
            <button onClick={function () { navigate("landing"); }} style={{ marginTop: "20px", background: "#5B6CF0", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "10px", cursor: "pointer" }}>Back Home</button>
          </div>
        )}

        {view === "roast" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>🔥 Article Roaster</h1>
            <p style={{ color: TH.textSec }}>Roast view loaded!</p>
            <button onClick={function () { navigate("landing"); }} style={{ marginTop: "20px", background: "#5B6CF0", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "10px", cursor: "pointer" }}>Back Home</button>
          </div>
        )}

        {view === "battle" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>⚔️ Battle Arena</h1>
            <p style={{ color: TH.textSec }}>Battle view loaded!</p>
            <button onClick={function () { navigate("landing"); }} style={{ marginTop: "20px", background: "#5B6CF0", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "10px", cursor: "pointer" }}>Back Home</button>
          </div>
        )}

        {view === "pricing" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>💎 Pricing</h1>
            <p style={{ color: TH.textSec }}>Pricing view loaded!</p>
          </div>
        )}

        {view === "contact" && (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>📩 Contact</h1>
            <p style={{ color: TH.textSec }}>Contact view loaded!</p>
          </div>
        )}
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#5B6CF0", color: "#fff", padding: "12px 24px", borderRadius: "12px", zIndex: 300 }}>{toast}</div>
      )}

      <footer style={{ borderTop: "1px solid " + TH.border, padding: "20px", textAlign: "center" }}>
        <p style={{ color: TH.textSec, fontSize: "0.8rem" }}>© 2024 OxQuill. All rights reserved.</p>
      </footer>
    </div>
  );
}
