"use client";
import { useState, useEffect } from "react";

export default function ProfileView({
  darkMode, rtl, user, credits, articles, onDeleteArticle, showToast, t, TH, db
}) {
  var [tab, setTab] = useState("info");
  var [userArticles, setUserArticles] = useState(articles || []);

  useEffect(function () {
    if (db && user) {
      db.getUserArticles(user.id).then(function (arts) {
        if (arts) setUserArticles(arts);
      });
    }
  }, [user]);

  var LEVELS = [
    { level: 1, name: rtl ? "مبتدئ" : "Beginner", xp: 0, reward: rtl ? "10 كريديت مجاني" : "10 free credits", icon: "🌱" },
    { level: 2, name: rtl ? "كاتب" : "Writer", xp: 100, reward: rtl ? "فتح Remix" : "Unlock Remix", icon: "✏️" },
    { level: 3, name: rtl ? "محترف" : "Pro Writer", xp: 300, reward: rtl ? "فتح Battle" : "Unlock Battle", icon: "📝" },
    { level: 4, name: rtl ? "خبير" : "Expert", xp: 600, reward: rtl ? "+5 كريديت مجاني" : "+5 free credits", icon: "⭐" },
    { level: 5, name: rtl ? "ماستر" : "Master", xp: 1000, reward: rtl ? "فتح Writers" : "Unlock Writers", icon: "🏆" },
    { level: 6, name: rtl ? "جراند ماستر" : "Grand Master", xp: 1500, reward: rtl ? "بادج ذهبي" : "Gold Badge", icon: "👑" },
    { level: 7, name: rtl ? "أسطورة" : "Legend", xp: 2500, reward: rtl ? "+10 كريديت" : "+10 credits", icon: "🌟" },
    { level: 8, name: rtl ? "ملهم" : "Visionary", xp: 4000, reward: rtl ? "بادج بلاتينيوم" : "Platinum Badge", icon: "💎" },
    { level: 9, name: rtl ? "عبقري" : "Genius", xp: 6000, reward: rtl ? "+20 كريديت" : "+20 credits", icon: "🧠" },
    { level: 10, name: rtl ? "خارق" : "Superbrain", xp: 10000, reward: rtl ? "عضوية VIP" : "VIP Membership", icon: "🦸" },
  ];

  var userXP = (user && user.xp) || 0;
  var currentLevel = LEVELS.reduce(function (acc, lv) {
    return userXP >= lv.xp ? lv : acc;
  }, LEVELS[0]);

  var tabs = [
    { id: "info", label: rtl ? "معلوماتي" : "My Info", icon: "👤" },
    { id: "articles", label: rtl ? "مقالاتي" : "My Articles", icon: "📄" },
    { id: "levels", label: rtl ? "المستويات" : "Levels", icon: "🏆" },
    { id: "settings", label: rtl ? "الإعدادات" : "Settings", icon: "⚙️" },
  ];

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "700px",
      margin: "0 auto",
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: "24px",
      }}>
        <div style={{
          width: "80px", height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px",
          fontSize: "2rem",
          color: "#fff",
        }}>
          {user && user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <h2 style={{ color: TH.text, fontWeight: 700, fontSize: "1.3rem" }}>
          {(user && user.name) || (rtl ? "مستخدم" : "User")}
        </h2>
        <p style={{ color: TH.textSec, fontSize: "0.9rem" }}>
          {currentLevel.icon} {currentLevel.name} • {credits} {rtl ? "كريديت" : "credits"}
        </p>
      </div>

      <div style={{
        display: "flex",
        gap: "6px",
        marginBottom: "24px",
        overflowX: "auto",
        paddingBottom: "4px",
      }}>
        {tabs.map(function (tb) {
          var active = tab === tb.id;
          return (
            <button key={tb.id}
              onClick={function () { setTab(tb.id); }}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: "10px",
                border: active ? "2px solid #5B6CF0" : "1px solid " + TH.border,
                background: active ? "rgba(91,108,240,0.1)" : "transparent",
                color: active ? "#5B6CF0" : TH.textSec,
                fontWeight: active ? 700 : 500,
                fontSize: "0.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
              {tb.icon} {tb.label}
            </button>
          );
        })}
      </div>

      {tab === "info" && (
        <div style={{
          background: TH.card,
          border: "1px solid " + TH.border,
          borderRadius: "16px",
          padding: "24px",
        }}>
          {[
            { label: rtl ? "الاسم" : "Name", value: (user && user.name) || "-" },
            { label: rtl ? "البريد" : "Email", value: (user && user.email) || "-" },
            { label: rtl ? "الرصيد" : "Credits", value: credits },
            { label: rtl ? "المستوى" : "Level", value: currentLevel.icon + " " + currentLevel.name },
            { label: rtl ? "XP" : "XP", value: userXP },
            { label: rtl ? "المقالات" : "Articles", value: userArticles.length },
          ].map(function (row, i) {
            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < 5 ? "1px solid " + TH.border : "none",
              }}>
                <span style={{ color: TH.textSec, fontSize: "0.9rem" }}>{row.label}</span>
                <span style={{ color: TH.text, fontWeight: 600, fontSize: "0.9rem" }}>{row.value}</span>
              </div>
            );
          })}
        </div>
      )}

      {tab === "articles" && (
        <div>
          {userArticles.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 20px",
              color: TH.textSec,
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</div>
              <p>{rtl ? "لسه ما كتبت مقالات" : "No articles yet"}</p>
            </div>
          ) : (
            userArticles.map(function (art, i) {
              return (
                <div key={i} style={{
                  background: TH.card,
                  border: "1px solid " + TH.border,
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "10px",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700,
                        color: TH.text,
                        fontSize: "0.95rem",
                        marginBottom: "4px",
                      }}>
                        {art.title || art.topic || (rtl ? "مقال" : "Article")}
                      </div>
                      <div style={{
                        color: TH.textSec,
                        fontSize: "0.8rem",
                      }}>
                        {art.language} • {art.mood} • {art.word_count || "?"} {rtl ? "كلمة" : "words"}
                      </div>
                    </div>
                    {onDeleteArticle && (
                      <button onClick={function () { onDeleteArticle(art.id || i); }} style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "none",
                        color: "#EF4444",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}>🗑️</button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "levels" && (
        <div>
          {LEVELS.map(function (lv, i) {
            var reached = userXP >= lv.xp;
            var isCurrent = currentLevel.level === lv.level;
            return (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "8px",
                background: isCurrent
                  ? "rgba(91,108,240,0.08)"
                  : reached ? TH.card : "transparent",
                border: isCurrent
                  ? "2px solid #5B6CF0"
                  : "1px solid " + (reached ? TH.border : "transparent"),
                opacity: reached ? 1 : 0.5,
              }}>
                <div style={{ fontSize: "1.5rem" }}>{lv.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700,
                    color: TH.text,
                    fontSize: "0.9rem",
                  }}>
                    {rtl ? "مستوى " : "Level "}{lv.level} — {lv.name}
                  </div>
                  <div style={{
                    color: TH.textSec,
                    fontSize: "0.8rem",
                  }}>
                    {lv.xp} XP • {lv.reward}
                  </div>
                </div>
                {reached && (
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "settings" && (
        <div style={{
          background: TH.card,
          border: "1px solid " + TH.border,
          borderRadius: "16px",
          padding: "24px",
          textAlign: "center",
          color: TH.textSec,
        }}>
          <p>{rtl ? "الإعدادات قريباً..." : "Settings coming soon..."}</p>
        </div>
      )}
    </div>
  );
}
