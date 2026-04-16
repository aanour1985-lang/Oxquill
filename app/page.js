"use client";
import { useState, useEffect } from "react";
import { LIGHT, DARK } from "./lib/theme";
import { PLANS } from "./data/plans";
import { TESTIMONIALS } from "./data/testimonials";
import { LANGS, MOODS, COSTS } from "./data/constants";
import { t as translate } from "./lib/i18n";
import { canShare } from "./lib/permissions";
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

try {
  var supMod = require("./lib/supabase");
  safeSupabase = supMod.supabase;
} catch (e) {
  console.warn("Supabase init skipped:", e.message);
}

try {
  safeDb = require("./lib/db");
} catch (e) {
  console.warn("DB init skipped:", e.message);
}

var SafeNav = null;
var SafeSidebar = null;
var SafeFooter = null;
var SafeToast = null;
var SafeAuthModal = null;

try { SafeNav = require("./components/Nav").default; } catch (e) {}
try { SafeSidebar = require("./components/Sidebar").default; } catch (e) {}
try { SafeFooter = require("./components/Footer").default; } catch (e) {}
try { SafeToast = require("./components/Toast").default; } catch (e) {}
try { SafeAuthModal = require("./components/AuthModal").default; } catch (e) {}

export default function Home() {
  var [darkMode, setDarkMode] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [user, setUser] = useState(null);
  var [credits, setCredits] = useState(10);
  var [view, setView] = useState("landing");
  var [sidebarOpen, setSidebarOpen] = useState(false);
  var [showAuth, setShowAuth] = useState(false);
  var [toast, setToast] = useState(null);
  var [articles, setArticles] = useState([]);
  var [error, setError] = useState(null);

  var TH = darkMode ? DARK : LIGHT;

  function t(key) {
    try { return translate(key, rtl ? "ar" : "en"); }
    catch (e) { return key; }
  }

  function showToast(msg, type) {
    setToast({ message: msg, type: type || "info" });
    setTimeout(function () { setToast(null); }, 3000);
  }

  function navigate(newView) {
    setView(newView);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }

  function handleCreditsChange(amount) {
    setCredits(function (prev) {
      var newVal = prev + amount;
      if (user && safeDb) {
        try {
          if (amount < 0) {
            safeDb.useCredits(user.id, Math.abs(amount), "tool_usage");
          } else {
            safeDb.addCredits(user.id, amount, "purchase");
          }
        } catch (e) { console.warn("Credits error:", e); }
      }
      return newVal;
    });
  }

  function handleDeleteArticle(articleId) {
    if (safeDb) {
      safeDb.deleteArticle(articleId).then(function () {
        setArticles(function (prev) {
          return prev.filter(function (a) { return a.id !== articleId; });
        });
        showToast(rtl ? "تم حذف المقال" : "Article deleted", "success");
      });
    }
  }

  useEffect(function () {
    try {
      var savedDark = localStorage.getItem("oxquill_dark");
      var savedRtl = localStorage.getItem("oxquill_rtl");
      if (savedDark === "true") setDarkMode(true);
      if (savedRtl === "true") setRtl(true);
    } catch (e) {}

    if (safeSupabase) {
      try {
        safeSupabase.auth.getSession().then(function (result) {
          var session = result.data.session;
          if (session && session.user) {
            loadUser(session.user);
          }
        });

        safeSupabase.auth.onAuthStateChange(function (event, session) {
          if (event === "SIGNED_IN" && session && session.user) {
            loadUser(session.user);
            setShowAuth(false);
            navigate("writer");
          }
          if (event === "SIGNED_OUT") {
            setUser(null);
            setCredits(10);
            setArticles([]);
            navigate("landing");
          }
        });
      } catch (e) {
        console.warn("Auth error:", e);
      }
    }
  }, []);

  useEffect(function () {
    try { localStorage.setItem("oxquill_dark", darkMode); } catch (e) {}
  }, [darkMode]);

  useEffect(function () {
    try { localStorage.setItem("oxquill_rtl", rtl); } catch (e) {}
  }, [rtl]);

  async function loadUser(authUser) {
    if (!safeDb) return;
    try {
      var profile = await safeDb.getProfile(authUser.id);
      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profile.full_name || authUser.user_metadata.full_name || "",
          plan: profile.plan || "free",
          is_admin: profile.is_admin || false,
          banned: profile.banned || false,
          xp: profile.xp || 0,
        });
        setCredits(profile.credits || 10);
        var arts = await safeDb.getArticles(authUser.id);
        if (arts) setArticles(arts);
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata.full_name || "",
          plan: "free",
          is_admin: authUser.email === "aanour1985@gmail.com",
          banned: false,
          xp: 0,
        });
      }
    } catch (e) {
      console.warn("Load user error:", e);
    }
  }

  async function handleLogout() {
    if (safeDb) {
      try { await safeDb.signOut(); } catch (e) {}
    }
    setUser(null);
    setCredits(10);
    navigate("landing");
    showToast(rtl ? "تم تسجيل الخروج" : "Logged out", "success");
  }

  function toggleDark() { setDarkMode(function (p) { return !p; }); }
  function toggleRtl() { setRtl(function (p) { return !p; }); }

  var dbProxy = {
    getUserArticles: safeDb ? safeDb.getArticles : function () { return Promise.resolve([]); },
    getMessages: safeDb ? safeDb.getContactMessages : function () { return Promise.resolve([]); },
    getStats: function () { return Promise.resolve({ totalUsers: 0, totalArticles: 0, totalCreditsUsed: 0 }); },
    getApiUsage: function () { return Promise.resolve({ monthlyTokens: 0, estimatedCost: 0, balance: 5.00 }); },
    updateApiUsage: function () { return Promise.resolve(); },
    getAllUsers: safeDb ? safeDb.getAllUsers : function () { return Promise.resolve([]); },
    updateUser: function (id, updates) {
      if (!safeDb) return Promise.resolve();
      if (updates.banned !== undefined) return safeDb.blockUser(id, updates.banned);
      if (updates.is_admin !== undefined) return safeDb.makeAdmin(id, updates.is_admin);
      return Promise.resolve();
    },
    updateMessage: function () { return Promise.resolve(); },
    createMessage: function (msg) {
      if (!safeDb) return Promise.resolve();
      return safeDb.sendContactMessage(user ? user.id : null, msg.type, msg.subject, msg.message);
    },
    getWriters: function () { return Promise.resolve([]); },
    getCreditTransactions: function () { return Promise.resolve([]); },
  };

  var CONSTANTS_OBJ = {
    LANGUAGES: LANGS || [],
    MOODS: MOODS || [],
    COSTS: COSTS || {},
  };

  var commonProps = {
    darkMode: darkMode,
    rtl: rtl,
    user: user,
    credits: credits,
    showToast: showToast,
    t: t,
    TH: TH,
    db: dbProxy,
  };

  function renderView() {
    try {
      switch (view) {
        case "writer":
          return <WriterView {...commonProps} onCreditsChange={handleCreditsChange} CONSTANTS={CONSTANTS_OBJ} />;
        case "roast":
          return <RoastView {...commonProps} onCreditsChange={handleCreditsChange} />;
        case "battle":
          return <BattleView {...commonProps} onCreditsChange={handleCreditsChange} />;
        case "profile":
          return <ProfileView {...commonProps} articles={articles} onDeleteArticle={handleDeleteArticle} />;
        case "admin":
          if (!user || !user.is_admin) { navigate("landing"); return null; }
          return <AdminView {...commonProps} />;
        case "writers":
          return <WritersView {...commonProps} />;
        case "pricing":
          return <PricingView {...commonProps} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS} />;
        case "credits":
          return <CreditsView {...commonProps} onNavigate={navigate} />;
        case "contact":
          return <ContactView {...commonProps} />;
        case "terms":
          return <TermsView {...commonProps} />;
        default:
          return <Landing {...commonProps} onNavigate={navigate} onLogin={function () { setShowAuth(true); }} PLANS={PLANS} TESTIMONIALS={TESTIMONIALS} />;
      }
    } catch (e) {
      return <div style={{ padding: "100px 20px", textAlign: "center", color: "#EF4444" }}>Error: {e.message}</div>;
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: TH.bg,
      color: TH.text,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      direction: rtl ? "rtl" : "ltr",
    }}>
      {SafeNav && (
        <SafeNav darkMode={darkMode} rtl={rtl} user={user} credits={credits} TH={TH} t={t}
          onToggleSidebar={function () { setSidebarOpen(function (p) { return !p; }); }}
          onToggleDark={toggleDark} onToggleRtl={toggleRtl} onNavigate={navigate}
          onLogin={function () { setShowAuth(true); }} onLogout={handleLogout}
        />
      )}

      {SafeSidebar && (
        <SafeSidebar darkMode={darkMode} rtl={rtl} user={user} credits={credits}
          isOpen={sidebarOpen} TH={TH} t={t}
          onClose={function () { setSidebarOpen(false); }}
          onNavigate={navigate} onLogin={function () { setShowAuth(true); }} onLogout={handleLogout}
        />
      )}

      <main style={{ minHeight: "calc(100vh - 140px)" }}>
        {renderView()}
      </main>

      {SafeFooter && (
        <SafeFooter darkMode={darkMode} rtl={rtl} TH={TH} t={t}
          onToggleDark={toggleDark} onToggleRtl={toggleRtl} onNavigate={navigate}
        />
      )}

      {showAuth && SafeAuthModal && (
        <SafeAuthModal darkMode={darkMode} rtl={rtl} TH={TH} t={t}
          supabase={safeSupabase} showToast={showToast}
          onClose={function () { setShowAuth(false); }}
        />
      )}

      {​​​​​​​​​​​​​​​​
