"use client";
import { useState, useEffect } from "react";
import { LIGHT, DARK } from "./lib/theme";
import { PLANS } from "./data/plans";
import { TESTIMONIALS } from "./data/testimonials";
import { LANGS, MOODS, COSTS } from "./data/constants";
import { t as translate } from "./lib/i18n";
import Landing from "./views/Landing";
import WriterView from "./views/WriterView";
import RoastView from "./views/RoastView";
import BattleView from "./views/BattleView";
import ProfileView from "./views/ProfileView";
import AdminView from "./views/AdminView";
import WritersView from "./views/WritersView";
import PricingView from "./views/PricingView";
import ContactView from "./views/ContactView";
import CreditsView from "./views/CreditsView";
import TermsView from "./views/TermsView";

var safeSupabase = null;
var safeDb = null;
try { safeSupabase = require("./lib/supabase").supabase; } catch (e) {}
try { safeDb = require("./lib/db"); } catch (e) {}

export default function Home() {
  var [darkMode, setDarkMode] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [user, setUser] = useState(null);
  var [credits, setCredits] = useState(10);
  var [view, setView] = useState("landing");
  var [showMenu, setShowMenu] = useState(false);
  var [showAuth, setShowAuth] = useState(false);
  var [authMode, setAuthMode] = useState("login");
  var [authEmail, setAuthEmail] = useState("");
  var [authPass, setAuthPass] = useState("");
  var [authName, setAuthName] = useState("");
  var [authLoading, setAuthLoading] = useState(false);
  var [toast, setToast] = useState(null);
  var [articles, setArticles] = useState([]);

  var TH = darkMode ? DARK : LIGHT;

  function t(key) {
    try { return translate(key, rtl ? "ar" : "en"); }
    catch (e) { return key; }
  }

  function showToast(msg, type) {
    setToast({ message: msg, type: type || "info" });
    setTimeout(function () { setToast(null); }, 3000);
  }

  function navigate(v) {
    setView(v);
    setShowMenu(false);
    window.scrollTo(0, 0);
  }

  function handleCreditsChange(amount) {
    setCredits(function (prev) { return prev + amount; });
  }

  useEffect(function () {
    try {
      if (localStorage.getItem("oxquill_dark") === "true") setDarkMode(true);
      if (localStorage.getItem("oxquill_rtl") === "true") setRtl(true);
    } catch (e) {}

    if (safeSupabase) {
      try {
        safeSupabase.auth.getSession().then(function (r) {
          if (r.data.session && r.data.session.user) loadUser(r.data.session.user);
        });
        safeSupabase.auth.onAuthStateChange(function (ev, session) {
          if (ev === "SIGNED_IN" && session) { loadUser(session.user); setShowAuth(false); navigate("writer"); }
          if (ev === "SIGNED_OUT") { setUser(null); setCredits(10); navigate("landing"); }
        });
      } catch (e) {}
    }
  }, []);

  useEffect(function () { try { localStorage.setItem("oxquill_dark", darkMode); } catch (e) {} }, [darkMode]);
  useEffect(function () { try { localStorage.setItem("oxquill_rtl", rtl); } catch (e) {} }, [rtl]);

  async function loadUser(au) {
    if (!safeDb) return;
    try {
      var p = await safeDb.getProfile(au.id);
      if (p) {
        setUser({ id: au.id, email: au.email, name: p.full_name || "", plan: p.plan || "free", is_admin: p.is_admin || false, xp: p.xp || 0 });
        setCredits(p.credits || 10);
      } else {
        setUser({ id: au.id, email: au.email, name: au.user_metadata.full_name || "", plan: "free", is_admin: au.email === "aanour1985@gmail.com", xp: 0 });
      }
    } catch (e) {}
  }

  async function handleLogin() {
    if (!safeDb) { showToast("DB not ready", "error"); return; }
    if (!authEmail || !authPass) { showToast(rtl ? "اكتب البريد والباسورد" : "Enter email & password", "error"); return; }
    setAuthLoading(true);
    try {
      var r = await safeDb.signIn(authEmail, authPass);
      if (r && r.error) showToast(r.error.message, "error");
    } catch (e) { showToast(e.message, "error"); }
    setAuthLoading(false);
  }

  async function handleSignup() {
    if (!safeDb) { showToast("DB not ready", "error"); return; }
    if (!authEmail || !authPass || !authName) { showToast(rtl ? "اكتب كل البيانات" : "Fill all fields", "error"); return; }
    setAuthLoading(true);
    try {
      var r = await safeDb.signUp(authEmail, authPass, authName, "neutral");
      if (r && r.error) showToast(r.error.message, "error");
      else showToast(rtl ? "تم التسجيل! أكد بريدك" : "Signed up! Check email", "success");
    } catch (e) { showToast(e.message, "error"); }
    setAuthLoading(false);
  }

  async function handleLogout() {
    if (safeDb) try { await safeDb.signOut(); } catch (e) {}
    setUser(null); setCredits(10); navigate("landing");
  }

  var dbProxy = {
    getUserArticles: safeDb ? safeDb.getArticles : function () { return Promise.resolve([]); },
    getMessages: safeDb ? safeDb.getContactMessages : function () { return Promise.resolve([]); },
    getStats: function () { return Promise.resolve({ totalUsers: 0, totalArticles: 0, totalCreditsUsed: 0 }); },
    getApiUsage: function () { return Promise.resolve({ monthlyTokens: 0, estimatedCost: 0, balance: 5.00 }); },
    updateApiUsage: function () { return Promise.resolve(); },
    getAllUsers: safeDb ? safeDb.getAllUsers : function () { return Promise.resolve([]); },
    updateUser: function (id, u) {
      if (!safeDb) return Promise.resolve();
      if (u.banned !== undefined) return safeDb.blockUser(id, u.banned);
      if (u.is_admin !== undefined) return safeDb.makeAdmin(id, u.is_admin);
      return Promise.resolve();
    },
    updateMessage: function () { return Promise.resolve(); },
    createMessage: function (m) {
      if (!safeDb) return Promise.resolve();
      return safeDb.sendContactMessage(user ? user.id : null, m.type, m.subject, m.message);
    },
    getWriters: function () { return Promise.resolve([]); },
    getCreditTransactions: function () { return Promise.resolve([]); },
  };

  var commonProps = {
    darkMode: darkMode, rtl: rtl, user: user, credits: credits,
    showToast: showToast, t: t, TH: TH, db: dbProxy,
  };

  var menuItems = user
    ? [
        { id: "writer", label: "✍️ Writer" },
        { id: "roast", label: "🔥 Roast" },
        { id: "battle", label: "⚔️ Battle" },
        { id: "writers", label: "👥 Writers" },
        { id: "profile", label: "👤 Profile" },
        { id: "credits", label: "🪙 Credits" },
        { id: "pricing", label: "💎 Pricing" },
        { id: "contact", label: "📩 Contact" },
      ]
    : [
        { id: "pricing", label: "💎 Pricing" },
        { id: "contact", label: "📩 Contact" },
      ];

  if (user && user.is_admin) menuItems.push({ id: "admin", label: "🛡️ Admin" });

  return (
    <div style={{ minHeight: "100vh", background: TH.bg, color: TH.text, fontFamily: "'Plus Jakarta Sans', sans-serif", direction: rtl ? "rtl" : "ltr" }}>

      {/* === NAV === */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: TH.card, borderBottom: "1px solid " + TH.border, padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={function () { setShowMenu(!showMenu); }} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: TH.text }}>☰</button>
          <span onClick={function () { navigate("landing"); }} style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 800, fontSize: "1.2rem", cursor: "pointer", color: TH.text }}>✍️ OxQuill</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user && <span style={{ fontSize: "0.8rem", color: "#5B6CF0", fontWeight: 700 }}>{credits} 🪙</span>}
          <button onClick={function () { setDarkMode(!darkMode); }} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer" }}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={function () { setRtl(!rtl); }} style={{ background: "none", border: "none", fontSize: "0.8rem", cursor: "pointer", color: TH.textSec, fontWeight: 700 }}>{rtl ? "EN" : "AR"}</button>
          {user
            ? <button onClick={handleLogout} style={{ background: "none", border: "1px solid #EF4444", color: "#EF4444", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}>{rtl ? "خروج" : "Logout"}</button>
            : <button onClick={function () { setShowAuth(true); }} style={{ background: "#5B6CF0", border: "none", color: "#fff", padding: "6px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>{rtl ? "دخول" : "Login"}</button>
          }
        </div>
      </nav>

      {/* === MENU === */}
      {showMenu && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, bottom: 0, zIndex: 99 }}>
          <div onClick={function () { setShowMenu(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "relative", background: TH.card, borderBottom: "1px solid " + TH.border, padding: "8px 0", maxWidth: "300px" }}>
            {menuItems.map(function (item) {
              return (
                <button key={item.id} onClick={function () { navigate(item.id); }} style={{ display: "block", width: "100%", padding: "12px 20px", background: view === item.id ? "rgba(91,108,240,0.1)" : "transparent", border: "none", color: view === item.id ? "#5B6CF0" : TH.text, fontSize: "0.95rem", fontWeight: view === item.id ? 700 : 500, cursor: "pointer", textAlign: rtl ? "right" : "left" }}>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === MAIN === */}
      <main style={{ paddingTop: "56px", minHeight: "calc(100vh - 100px)" }}>
        {view === "landing" && <Landing {...commonProps} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS} TESTIMONIALS={TESTIMONIALS} />}
        {view === "writer" && <WriterView {...commonProps} onCreditsChange={handleCreditsChange} CONSTANTS={{ LANGUAGES: LANGS, MOODS: MOODS, COSTS: COSTS }} />}
        {view === "roast" && <RoastView {...commonProps} onCreditsChange={handleCreditsChange} />}
        {view === "battle" && <BattleView {...commonProps} onCreditsChange={handleCreditsChange} />}
        {view === "profile" && <ProfileView {...commonProps} articles={articles} onDeleteArticle={function () {}} />}
        {view === "admin" && <AdminView {...commonProps} />}
        {view === "writers" && <WritersView {...commonProps} />}
        {view === "pricing" && <PricingView {...commonProps} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS} />}
        {view === "credits" && <CreditsView {...commonProps} onNavigate={navigate} />}
        {view === "contact" && <ContactView {...commonProps} />}
        {view === "terms" && <TermsView {...commonProps} />}
      </main>

      {/* === AUTH MODAL === */}
      {showAuth && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={function () { setShowAuth(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "relative", background: TH.card, borderRadius: "20px", padding: "32px 24px", width: "90%", maxWidth: "400px", border: "1px solid " + TH.border }}>
            <button onClick={function () { setShowAuth(false); }} style={{ position: "absolute", top: "12px", right: "16px", background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: TH.textSec }}>✕</button>
            <h2 style={{ textAlign: "center", marginBottom: "24px", fontFamily: "'Source Serif 4', serif", color: TH.text }}>{authMode === "login" ? (rtl ? "تسجيل دخول" : "Login") : (rtl ? "حساب جديد" : "Sign Up")}</h2>

            {authMode === "signup" && (
              <input value={authName} onChange={function (e) { setAuthName(e.target.value); }} placeholder={rtl ? "الاسم" : "Name"} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "12px", boxSizing: "border-box" }} />
            )}
            <input value={authEmail} onChange={function (e) { setAuthEmail(e.target.value); }} placeholder={rtl ? "البريد" : "Email"} type="email" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "12px", boxSizing: "border-box" }} />
            <input value={authPass} onChange={function (e) { setAuthPass(e.target.value); }} placeholder={rtl ? "كلمة السر" : "Password"} type="password" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "16px", boxSizing: "border-box" }} />

            <button onClick={authMode === "login" ? handleLogin : handleSignup} disabled={authLoading} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)", color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
              {authLoading ? "..." : authMode === "login" ? (rtl ? "دخول" : "Login") : (rtl ? "تسجيل" : "Sign Up")}
            </button>

            <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
              {authMode === "login" ? (rtl ? "مفيش حساب؟ " : "No account? ") : (rtl ? "عندك حساب؟ " : "Have account? ")}
              <span onClick={function () { setAuthMode(authMode === "login" ? "signup" : "login"); }} style={{ color: "#5B6CF0", cursor: "pointer", fontWeight: 700 }}>
                {authMode === "login" ? (rtl ? "سجل" : "Sign up") : (rtl ? "ادخل" : "Login")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* === TOAST === */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#EF4444" : toast.type === "success" ? "#22C55E" : "#3B82F6", color: "#fff", padding: "12px 24px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 600, zIndex: 300, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast.message}
        </div>
      )}

      {/* === FOOTER === */}
      <footer style={{ borderTop: "1px solid " + TH.border, padding: "24px 16px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
          {["pricing", "contact", "terms"].map(function (id) {
            return <span key={id} onClick={function () { navigate(id); }} style={{ color: TH.textSec, fontSize: "0.85rem", cursor: "pointer" }}>{id === "pricing" ? "💎 Pricing" : id === "contact" ? "📩 Contact" : "📜 Terms"}</span>;
          })}
        </div>
        <p style={{ color: TH.textSec, fontSize: "0.8rem" }}>© 2024 OxQuill. All rights reserved.</p>
      </footer>
    </div>
  );
}
