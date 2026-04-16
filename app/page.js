"use client";
import { useState, useEffect } from "react";
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

var LIGHT = { bg: "#FAFAFA", text: "#1A1A2E", textSec: "#6B7280", card: "#FFFFFF", border: "#E5E7EB", primary: "#5B6CF0" };
var DARK = { bg: "#0F0F1A", text: "#F1F1F1", textSec: "#9CA3AF", card: "#1A1A2E", border: "#2D2D44", primary: "#5B6CF0" };

var PLANS_DATA = [
  { id: "free", name: "Free", price: 0, credits: 10, features: ["10 credits/mo", "800 words max", "5 languages", "Watermark"] },
  { id: "starter", name: "Starter", price: 19, credits: 100, features: ["100 credits/mo", "2000 words", "28 languages", "No watermark"] },
  { id: "pro", name: "Pro", price: 49, credits: 500, popular: true, features: ["500 credits/mo", "5000 words", "All tools", "Writers Directory"] },
  { id: "agency", name: "Agency", price: 99, credits: 2000, features: ["2000 credits/mo", "Unlimited", "API access", "White label"] },
];

var TESTIMONIALS_DATA = [
  { nameEn: "Sarah K.", nameAr: "\u0633\u0627\u0631\u0629 \u0643.", roleEn: "Content Creator", roleAr: "\u0635\u0627\u0646\u0639\u0629 \u0645\u062d\u062a\u0648\u0649", textEn: "OxQuill transformed my writing workflow completely!", textAr: "\u0623\u0648\u0643\u0633\u0643\u0648\u064a\u0644 \u063a\u064a\u0651\u0631 \u0637\u0631\u064a\u0642\u0629 \u0643\u062a\u0627\u0628\u062a\u064a \u062a\u0645\u0627\u0645\u0627\u064b!", stars: 5 },
  { nameEn: "Ahmed M.", nameAr: "\u0623\u062d\u0645\u062f \u0645.", roleEn: "Blogger", roleAr: "\u0645\u062f\u0648\u0651\u0646", textEn: "The Time Machine feature is genius!", textAr: "\u0645\u064a\u0632\u0629 \u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646 \u0639\u0628\u0642\u0631\u064a\u0629!", stars: 5 },
  { nameEn: "Layla H.", nameAr: "\u0644\u064a\u0644\u0649 \u062d.", roleEn: "Marketer", roleAr: "\u0645\u0633\u0648\u0651\u0642\u0629", textEn: "28 languages? Game changer for global content.", textAr: "28 \u0644\u063a\u0629\u061f \u062a\u063a\u064a\u064a\u0631 \u062c\u0630\u0631\u064a \u0644\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0639\u0627\u0644\u0645\u064a.", stars: 5 },
];

var I18N = {
  feat_writer: { en: "AI Writer", ar: "\u0643\u0627\u062a\u0628 AI" },
  feat_roast: { en: "Article Roast", ar: "\u062a\u062d\u0645\u064a\u0635 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" },
  feat_battle: { en: "Battle Arena", ar: "\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0639\u0631\u0643\u0629" },
  feat_viral: { en: "Viral Predictor", ar: "\u0645\u062a\u0646\u0628\u0626 \u0627\u0644\u0627\u0646\u062a\u0634\u0627\u0631" },
  feat_remix: { en: "Remix", ar: "\u0631\u064a\u0645\u0643\u0633" },
  feat_timemachine: { en: "Time Machine", ar: "\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646" },
  feat_languages: { en: "28 Languages", ar: "28 \u0644\u063a\u0629" },
  feat_writers: { en: "Writers Dir", ar: "\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0651\u0627\u0628" },
  tool_generate: { en: "Generate", ar: "\u062a\u0648\u0644\u064a\u062f" },
  tool_roast: { en: "Roast", ar: "\u062a\u062d\u0645\u064a\u0635" },
  tool_viral: { en: "Viral", ar: "\u0627\u0646\u062a\u0634\u0627\u0631" },
  tool_remix: { en: "Remix", ar: "\u0631\u064a\u0645\u0643\u0633" },
  tool_debate: { en: "Debate", ar: "\u0645\u0646\u0627\u0638\u0631\u0629" },
  tool_summary: { en: "Summary", ar: "\u0645\u0644\u062e\u0635" },
  tool_titles: { en: "Titles", ar: "\u0639\u0646\u0627\u0648\u064a\u0646" },
  tool_thread: { en: "Thread", ar: "\u062b\u0631\u064a\u062f" },
  tool_linkedin: { en: "LinkedIn", ar: "\u0644\u064a\u0646\u0643\u062f\u0625\u0646" },
  tool_repurpose: { en: "Repurpose", ar: "\u0625\u0639\u0627\u062f\u0629 \u062a\u0648\u0638\u064a\u0641" },
};

var safeSupabase = null;
var safeDb = null;
try { var sm = require("./lib/supabase"); safeSupabase = sm.supabase; } catch (e) {}
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
    var entry = I18N[key];
    if (entry) return rtl ? entry.ar : entry.en;
    return key;
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
    setCredits(function (prev) {
      var nv = prev + amount;
      if (user && safeDb) {
        try {
          if (amount < 0) safeDb.useCredits(user.id, Math.abs(amount), "tool");
          else safeDb.addCredits(user.id, amount, "purchase");
        } catch (e) {}
      }
      return nv;
    });
  }

  useEffect(function () {
    try {
      if (localStorage.getItem("oxquill_dark") === "true") setDarkMode(true);
      if (localStorage.getItem("oxquill_rtl") === "true") setRtl(true);
    } catch (e) {}
    if (safeSupabase) {
      try {
        safeSupabase.auth.getSession().then(function (r) {
          if (r.data.session) loadUser(r.data.session.user);
        });
        safeSupabase.auth.onAuthStateChange(function (ev, s) {
          if (ev === "SIGNED_IN" && s) { loadUser(s.user); setShowAuth(false); navigate("writer"); }
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

  async function doLogin() {
    if (!safeDb || !authEmail || !authPass) { showToast("Fill all fields", "error"); return; }
    setAuthLoading(true);
    try { var r = await safeDb.signIn(authEmail, authPass); if (r && r.error) showToast(r.error.message, "error"); }
    catch (e) { showToast(e.message, "error"); }
    setAuthLoading(false);
  }

  async function doSignup() {
    if (!safeDb || !authEmail || !authPass || !authName) { showToast("Fill all fields", "error"); return; }
    setAuthLoading(true);
    try {
      var r = await safeDb.signUp(authEmail, authPass, authName, "neutral");
      if (r && r.error) showToast(r.error.message, "error");
      else showToast("Done! Check email", "success");
    } catch (e) { showToast(e.message, "error"); }
    setAuthLoading(false);
  }

  async function doLogout() {
    if (safeDb) try { await safeDb.signOut(); } catch (e) {}
    setUser(null); setCredits(10); navigate("landing");
  }

  var dbProxy = {
    getUserArticles: function () { return safeDb ? safeDb.getArticles(user ? user.id : "") : Promise.resolve([]); },
    getMessages: function () { return safeDb ? safeDb.getContactMessages() : Promise.resolve([]); },
    getStats: function () { return Promise.resolve({ totalUsers: 0, totalArticles: 0, totalCreditsUsed: 0 }); },
    getApiUsage: function () { return Promise.resolve({ monthlyTokens: 0, estimatedCost: 0, balance: 5 }); },
    updateApiUsage: function () { return Promise.resolve(); },
    getAllUsers: function () { return safeDb ? safeDb.getAllUsers() : Promise.resolve([]); },
    updateUser: function (id, u) {
      if (!safeDb) return Promise.resolve();
      if (u.banned !== undefined) return safeDb.blockUser(id, u.banned);
      if (u.is_admin !== undefined) return safeDb.makeAdmin(id, u.is_admin);
      return Promise.resolve();
    },
    updateMessage: function () { return Promise.resolve(); },
    createMessage: function (m) { return safeDb ? safeDb.sendContactMessage(user ? user.id : null, m.type, m.subject, m.message) : Promise.resolve(); },
    getWriters: function () { return Promise.resolve([]); },
    getCreditTransactions: function () { return Promise.resolve([]); },
  };

  var cp = { darkMode: darkMode, rtl: rtl, user: user, credits: credits, showToast: showToast, t: t, TH: TH, db: dbProxy };

  var menuItems = [
    { id: "landing", label: "\ud83c\udfe0 Home" },
    { id: "writer", label: "\u270d\ufe0f Writer" },
    { id: "roast", label: "\ud83d\udd25 Roast" },
    { id: "battle", label: "\u2694\ufe0f Battle" },
    { id: "writers", label: "\ud83d\udc65 Writers" },
    { id: "pricing", label: "\ud83d\udc8e Pricing" },
    { id: "credits", label: "\ud83e\ude99 Credits" },
    { id: "profile", label: "\ud83d\udc64 Profile" },
    { id: "contact", label: "\ud83d\udce9 Contact" },
    { id: "terms", label: "\ud83d\udcdc Terms" },
  ];
  if (user && user.is_admin) menuItems.push({ id: "admin", label: "\ud83d\udee1\ufe0f Admin" });

  return (
    <div style={{ minHeight: "100vh", background: TH.bg, color: TH.text, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", direction: rtl ? "rtl" : "ltr" }}>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: TH.card, borderBottom: "1px solid " + TH.border, padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={function () { setShowMenu(!showMenu); }} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: TH.text }}>&#9776;</button>
          <span onClick={function () { navigate("landing"); }} style={{ fontWeight: 800, fontSize: "1.2rem", cursor: "pointer", color: TH.text }}>&#9997;&#65039; OxQuill</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user && <span style={{ fontSize: "0.8rem", color: "#5B6CF0", fontWeight: 700 }}>{credits} &#129689;</span>}
          <button onClick={function () { setDarkMode(!darkMode); }} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer" }}>{darkMode ? "\u2600\ufe0f" : "\ud83c\udf19"}</button>
          <button onClick={function () { setRtl(!rtl); }} style={{ background: "none", border: "none", fontSize: "0.8rem", cursor: "pointer", color: TH.textSec, fontWeight: 700 }}>{rtl ? "EN" : "AR"}</button>
          {user
            ? <button onClick={doLogout} style={{ background: "none", border: "1px solid #EF4444", color: "#EF4444", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}>{rtl ? "\u062e\u0631\u0648\u062c" : "Logout"}</button>
            : <button onClick={function () { setShowAuth(true); }} style={{ background: "#5B6CF0", border: "none", color: "#fff", padding: "6px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>{rtl ? "\u062f\u062e\u0648\u0644" : "Login"}</button>
          }
        </div>
      </nav>

      {showMenu && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, bottom: 0, zIndex: 99 }}>
          <div onClick={function () { setShowMenu(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "relative", background: TH.card, padding: "8px 0", maxWidth: "280px", borderRight: "1px solid " + TH.border }}>
            {user && (
              <div style={{ padding: "16px 20px", borderBottom: "1px solid " + TH.border, marginBottom: "8px" }}>
                <div style={{ fontWeight: 700, color: TH.text }}>{user.name || user.email}</div>
                <div style={{ fontSize: "0.8rem", color: "#5B6CF0" }}>{credits} credits</div>
              </div>
            )}
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

      <main style={{ paddingTop: "56px", minHeight: "calc(100vh - 120px)" }}>
        {view === "landing" && <Landing {...cp} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS_DATA} TESTIMONIALS={TESTIMONIALS_DATA} />}
        {view === "writer" && <WriterView {...cp} onCreditsChange={handleCreditsChange} CONSTANTS={{ LANGUAGES: null, MOODS: null }} />}
        {view === "roast" && <RoastView {...cp} onCreditsChange={handleCreditsChange} />}
        {view === "battle" && <BattleView {...cp} onCreditsChange={handleCreditsChange} />}
        {view === "profile" && <ProfileView {...cp} articles={articles} onDeleteArticle={function () {}} />}
        {view === "admin" && user && user.is_admin && <AdminView {...cp} />}
        {view === "writers" && <WritersView {...cp} />}
        {view === "pricing" && <PricingView {...cp} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS_DATA} />}
        {view === "credits" && <CreditsView {...cp} onNavigate={navigate} />}
        {view === "contact" && <ContactView {...cp} />}
        {view === "terms" && <TermsView {...cp} />}
      </main>

      {showAuth && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={function () { setShowAuth(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "relative", background: TH.card, borderRadius: "20px", padding: "32px 24px", width: "90%", maxWidth: "400px", border: "1px solid " + TH.border }}>
            <button onClick={function () { setShowAuth(false); }} style={{ position: "absolute", top: "12px", right: "16px", background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: TH.textSec }}>&times;</button>
            <h2 style={{ textAlign: "center", marginBottom: "24px", color: TH.text, fontSize: "1.3rem", fontWeight: 700 }}>
              {authMode === "login" ? (rtl ? "\u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644" : "Login") : (rtl ? "\u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f" : "Sign Up")}
            </h2>
            {authMode === "signup" && (
              <input value={authName} onChange={function (e) { setAuthName(e.target.value); }} placeholder={rtl ? "\u0627\u0644\u0627\u0633\u0645" : "Name"} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "12px", boxSizing: "border-box" }} />
            )}
            <input value={authEmail} onChange={function (e) { setAuthEmail(e.target.value); }} placeholder={rtl ? "\u0627\u0644\u0628\u0631\u064a\u062f" : "Email"} type="email" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "12px", boxSizing: "border-box" }} />
            <input value={authPass} onChange={function (e) { setAuthPass(e.target.value); }} placeholder={rtl ? "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631" : "Password"} type="password" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid " + TH.border, background: TH.bg, color: TH.text, marginBottom: "16px", boxSizing: "border-box" }} />
            <button onClick={authMode === "login" ? doLogin : doSignup} disabled={authLoading} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)", color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
              {authLoading ? "..." : authMode === "login" ? (rtl ? "\u062f\u062e\u0648\u0644" : "Login") : (rtl ? "\u062a\u0633\u062c\u064a\u0644" : "Sign Up")}
            </button>
            <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
              <span onClick={function () { setAuthMode(authMode === "login" ? "signup" : "login"); }} style={{ color: "#5B6CF0", cursor: "pointer", fontWeight: 700 }}>
                {authMode === "login" ? (rtl ? "\u0633\u062c\u0651\u0644 \u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f" : "Create account") : (rtl ? "\u0639\u0646\u062f\u0643 \u062d\u0633\u0627\u0628\u061f \u0627\u062f\u062e\u0644" : "Have account? Login")}
              </span>
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#EF4444" : toast.type === "success" ? "#22C55E" : "#3B82F6", color: "#fff", padding: "12px 24px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 600, zIndex: 300 }}>
          {toast.message}
        </div>
      )}

      <footer style={{ borderTop: "1px solid " + TH.border, padding: "24px 16px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px", flexWrap: "wrap" }}>
          <span onClick={function () { navigate("pricing"); }} style={{ color: TH.textSec, fontSize: "0.85rem", cursor: "pointer" }}>&#128142; Pricing</span>
          <span onClick={function () { navigate("contact"); }} style={{ color: TH.textSec, fontSize: "0.85rem", cursor: "pointer" }}>&#128233; Contact</span>
          <span onClick={function () { navigate("terms"); }} style={{ color: TH.textSec, fontSize: "0.85rem", cursor: "pointer" }}>&#128220; Terms</span>
        </div>
        <p style={{ color: TH.textSec, fontSize: "0.8rem" }}>&copy; 2024 OxQuill. All rights reserved.</p>
      </footer>
    </div>
  );
}
