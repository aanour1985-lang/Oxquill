"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "./lib/supabase";
import { LIGHT, DARK } from "./lib/theme";
import { PLANS } from "./data/plans";
import { TESTIMONIALS } from "./data/testimonials";
import { CONSTANTS } from "./data/constants";
import { t as translate } from "./lib/i18n";
import { checkPermission } from "./lib/permissions";
import { formatDate, truncate } from "./lib/utils";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AuthModal from "./components/AuthModal";
import Watermark from "./components/Watermark";
import ShareModal from "./components/ShareModal";
import PayModal from "./components/PayModal";
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
import * as db from "./lib/db";

export default function Home() {
  var [darkMode, setDarkMode] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [user, setUser] = useState(null);
  var [credits, setCredits] = useState(10);
  var [view, setView] = useState("landing");
  var [sidebarOpen, setSidebarOpen] = useState(false);
  var [showAuth, setShowAuth] = useState(false);
  var [showPay, setShowPay] = useState(false);
  var [showShare, setShowShare] = useState(false);
  var [shareData, setShareData] = useState(null);
  var [toast, setToast] = useState(null);
  var [articles, setArticles] = useState([]);
  var [loading, setLoading] = useState(true);

  var supabase = createClient();
  var TH = darkMode ? DARK : LIGHT;

  function t(key) {
    return translate(key, rtl ? "ar" : "en");
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
      if (user) {
        db.updateCredits(user.id, newVal);
        db.logCreditTransaction(user.id, amount, amount < 0 ? "tool_usage" : "purchase");
      }
      return newVal;
    });
  }

  function handleDeleteArticle(articleId) {
    db.deleteArticle(articleId).then(function () {
      setArticles(function (prev) {
        return prev.filter(function (a) { return a.id !== articleId; });
      });
      showToast(rtl ? "تم حذف المقال" : "Article deleted", "success");
    });
  }

  function handleShare(data) {
    if (!user) {
      showToast(rtl ? "سجل دخول أولاً" : "Login first", "error");
      return;
    }
    var perm = checkPermission(user, "canShare");
    if (!perm) {
      showToast(rtl ? "ترقي خطتك للمشاركة" : "Upgrade to share", "error");
      return;
    }
    setShareData(data);
    setShowShare(true);
  }

  useEffect(function () {
    var savedDark = localStorage.getItem("oxquill_dark");
    var savedRtl = localStorage.getItem("oxquill_rtl");
    if (savedDark === "true") setDarkMode(true);
    if (savedRtl === "true") setRtl(true);

    supabase.auth.getSession().then(function (result) {
      var session = result.data.session;
      if (session && session.user) {
        loadUser(session.user);
      }
      setLoading(false);
    });

    var authListener = supabase.auth.onAuthStateChange(function (event, session) {
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

    return function () {
      if (authListener && authListener.data && authListener.data.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(function () {
    localStorage.setItem("oxquill_dark", darkMode);
  }, [darkMode]);

  useEffect(function () {
    localStorage.setItem("oxquill_rtl", rtl);
  }, [rtl]);

  async function loadUser(authUser) {
    var profile = await db.getProfile(authUser.id);
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
      var arts = await db.getUserArticles(authUser.id);
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
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast(rtl ? "تم تسجيل الخروج" : "Logged out", "success");
  }

  function toggleDark() {
    setDarkMode(function (p) { return !p; });
  }

  function toggleRtl() {
    setRtl(function (p) { return !p; });
  }
  
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: TH.bg,
        color: TH.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✍️</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>OxQuill</div>
          <div style={{ fontSize: "0.9rem", color: TH.textSec, marginTop: "8px" }}>
            {rtl ? "جاري التحميل..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  function renderView() {
    var commonProps = {
      darkMode: darkMode,
      rtl: rtl,
      user: user,
      credits: credits,
      showToast: showToast,
      t: t,
      TH: TH,
      db: db,
    };

    switch (view) {
      case "landing":
        return (
          <Landing
            {...commonProps}
            onNavigate={navigate}
            onLogin={function () { setShowAuth(true); }}
            PLANS={PLANS}
            TESTIMONIALS={TESTIMONIALS}
          />
        );
      case "writer":
        return (
          <WriterView
            {...commonProps}
            onCreditsChange={handleCreditsChange}
            CONSTANTS={CONSTANTS}
          />
        );
      case "roast":
        return (
          <RoastView
            {...commonProps}
            onCreditsChange={handleCreditsChange}
          />
        );
      case "battle":
        return (
          <BattleView
            {...commonProps}
            onCreditsChange={handleCreditsChange}
          />
        );
      case "profile":
        return (
          <ProfileView
            {...commonProps}
            articles={articles}
            onDeleteArticle={handleDeleteArticle}
          />
        );
      case "admin":
        if (!user || !user.is_admin) {
          navigate("landing");
          return null;
        }
        return <AdminView {...commonProps} />;
      case "writers":
        return <WritersView {...commonProps} />;
      case "pricing":
        return (
          <PricingView
            {...commonProps}
            onNavigate={navigate}
            onLogin={function () { setShowAuth(true); }}
            PLANS={PLANS}
          />
        );
      case "credits":
        return (
          <CreditsView
            {...commonProps}
            onNavigate={navigate}
          />
        );
      case "contact":
        return <ContactView {...commonProps} />;
      case "terms":
        return <TermsView {...commonProps} />;
      default:
        return (
          <Landing
            {...commonProps}
            onNavigate={navigate}
            onLogin={function () { setShowAuth(true); }}
            PLANS={PLANS}
            TESTIMONIALS={TESTIMONIALS}
          />
        );
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: TH.bg,
      color: TH.text,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      direction: rtl ? "rtl" : "ltr",
      transition: "background 0.3s, color 0.3s",
    }}>
      <Nav
        darkMode={darkMode}
        rtl={rtl}
        user={user}
        credits={credits}
        TH={TH}
        t={t}
        onToggleSidebar={function () { setSidebarOpen(function (p) { return !p; }); }}
        onToggleDark={toggleDark}
        onToggleRtl={toggleRtl}
        onNavigate={navigate}
        onLogin={function () { setShowAuth(true); }}
        onLogout={handleLogout}
      />

      <Sidebar
        darkMode={darkMode}
        rtl={rtl}
        user={user}
        credits={credits}
        isOpen={sidebarOpen}
        TH={TH}
        t={t}
        onClose={function () { setSidebarOpen(false); }}
        onNavigate={navigate}
        onLogin={function () { setShowAuth(true); }}
        onLogout={handleLogout}
      />

      <main style={{ minHeight: "calc(100vh - 140px)" }}>
        {renderView()}
      </main>

      <Footer
        darkMode={darkMode}
        rtl={rtl}
        TH={TH}
        t={t}
        onToggleDark={toggleDark}
        onToggleRtl={toggleRtl}
        onNavigate={navigate}
      />

      {showAuth && (
        <AuthModal
          darkMode={darkMode}
          rtl={rtl}
          TH={TH}
          t={t}
          supabase={supabase}
          showToast={showToast}
          onClose={function () { setShowAuth(false); }}
        />
      )}

      {showPay && (
        <PayModal
          darkMode={darkMode}
          rtl={rtl}
          TH={TH}
          t={t}
          showToast={showToast}
          onClose={function () { setShowPay(false); }}
        />
      )}

      {showShare && shareData && (
        <ShareModal
          darkMode={darkMode}
          rtl={rtl}
          TH={TH}
          t={t}
          data={shareData}
          showToast={showToast}
          onClose={function () { setShowShare(false); setShareData(null); }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={function () { setToast(null); }}
          TH={TH}
        />
      )}
    </div>
  );
}

