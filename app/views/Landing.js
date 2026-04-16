"use client";
import { useState, useEffect } from "react";

export default function Landing({
  darkMode, rtl, user, onNavigate, onLogin, t, TH, PLANS, TESTIMONIALS
}) {
  var [heroWord, setHeroWord] = useState(0);
  var [statAnim, setStatAnim] = useState(false);

  var rotatingWords = rtl
    ? ["مقالات", "قصص", "مدونات", "محتوى", "إبداع"]
    : ["Articles", "Stories", "Blogs", "Content", "Magic"];

  useEffect(function () {
    var interval = setInterval(function () {
      setHeroWord(function (p) { return (p + 1) % rotatingWords.length; });
    }, 2200);
    return function () { clearInterval(interval); };
  }, [rtl]);

  useEffect(function () {
    var timer = setTimeout(function () { setStatAnim(true); }, 400);
    return function () { clearTimeout(timer); };
  }, []);

  var features = [
    { icon: "✍️", key: "feat_writer", link: "writer" },
    { icon: "🔥", key: "feat_roast", link: "roast" },
    { icon: "⚔️", key: "feat_battle", link: "battle" },
    { icon: "📊", key: "feat_viral", link: "writer" },
    { icon: "🔄", key: "feat_remix", link: "writer" },
    { icon: "⏳", key: "feat_timemachine", link: "writer" },
    { icon: "🌍", key: "feat_languages", link: "writer" },
    { icon: "👥", key: "feat_writers", link: "writers" },
  ];

  var stats = [
    { num: "28", label: rtl ? "لغة" : "Languages" },
    { num: "31", label: rtl ? "حقبة زمنية" : "Time Eras" },
    { num: "10", label: rtl ? "أداة AI" : "AI Tools" },
    { num: "6", label: rtl ? "حالات مزاجية" : "Moods" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{
        padding: "100px 20px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-120px", left: "50%",
          transform: "translateX(-50%)", width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(91,108,240,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            lineHeight: 1.25,
            color: TH.text,
            marginBottom: "16px",
          }}>
            {rtl ? (
              <>
                {"كل كاتب يستاهل "}
                <span style={{
                  background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{"عقل خارق"}</span>
                {". ده عقلك."}
              </>
            ) : (
              <>
                {"Every Writer Deserves a "}
                <span style={{
                  background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{"Superbrain"}</span>
                {". Now You Have One."}
              </>
            )}
          </h1>

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: TH.textSec,
            maxWidth: "600px",
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            {rtl
              ? "من المسودة الأولى إلى التحفة المنشورة — في دقائق، مش شهور. 28 لغة. 31 حقبة. صوتك، بأضعاف قوته."
              : "From first draft to published masterpiece — in minutes, not months. 28 languages. 31 eras. Your voice, amplified."}
          </p>

          <div style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            fontFamily: "'Source Serif 4', serif",
            height: "50px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}>
            <span style={{ color: TH.textSec }}>
              {rtl ? "اكتب" : "Write"}
            </span>
            <span style={{
              background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "opacity 0.4s",
              minWidth: "140px",
              display: "inline-block",
            }}>
              {rotatingWords[heroWord]}
            </span>
          </div>

          <div style={{
            display: "flex", gap: "14px",
            justifyContent: "center", flexWrap: "wrap",
          }}>
            <button onClick={function () { user ? onNavigate("writer") : onLogin(); }} style={{
              background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
              color: "#fff",
              border: "none",
              padding: "14px 36px",
              borderRadius: "12px",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.25s",
              boxShadow: "0 4px 20px rgba(91,108,240,0.3)",
            }}>
              {rtl ? "ابدأ الكتابة مجاناً" : "Start Writing Free"}
            </button>
            <button onClick={function () { onNavigate("pricing"); }} style={{
              background: "transparent",
              color: TH.primary || "#5B6CF0",
              border: "2px solid " + (TH.primary || "#5B6CF0"),
              padding: "14px 36px",
              borderRadius: "12px",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.25s",
            }}>
              {rtl ? "شوف الخطط" : "View Plans"}
            </button>
          </div>
        </div>
      </section>

      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(20px, 5vw, 60px)",
        padding: "30px 20px",
        flexWrap: "wrap",
      }}>
        {stats.map(function (s, i) {
          return (
            <div key={i} style={{
              textAlign: "center",
              opacity: statAnim ? 1 : 0,
              transform: statAnim ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease " + (i * 0.12) + "s",
            }}>
              <div style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{s.num}</div>
              <div style={{
                fontSize: "0.85rem",
                color: TH.textSec,
                fontWeight: 600,
              }}>{s.label}</div>
            </div>
          );
        })}
      </section>

      <section style={{
        padding: "60px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}>
        <h2 style={{
          textAlign: "center",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: TH.text,
          marginBottom: "40px",
        }}>
          {rtl ? "أدوات خارقة لكتّاب خارقين" : "Superpowered Tools for Superpowered Writers"}
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}>
          {features.map(function (f, i) {
            return (
              <div key={i} onClick={function () { user ? onNavigate(f.link) : onLogin(); }} style={{
                background: TH.card,
                border: "1px solid " + TH.border,
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.25s",
                textAlign: "center",
              }}
              onMouseEnter={function (e) {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(91,108,240,0.12)";
                e.currentTarget.style.borderColor = "#5B6CF0";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = TH.border;
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{f.icon}</div>
                <div style={{
                  fontWeight: 700,
                  color: TH.text,
                  fontSize: "0.95rem",
                }}>{t(f.key)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {TESTIMONIALS && TESTIMONIALS.length > 0 && (
        <section style={{
          padding: "60px 20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}>
          <h2 style={{
            textAlign: "center",
            fontFamily: "'Source Serif 4', serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: TH.text,
            marginBottom: "32px",
          }}>
            {rtl ? "ماذا يقول كتّابنا" : "What Our Writers Say"}
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}>
            {TESTIMONIALS.map(function (tm, i) {
              return (
                <div key={i} style={{
                  background: TH.card,
                  border: "1px solid " + TH.border,
                  borderRadius: "16px",
                  padding: "24px",
                }}>
                  <div style={{
                    fontSize: "1.4rem",
                    marginBottom: "12px",
                  }}>{"⭐".repeat(tm.stars || 5)}</div>
                  <p style={{
                    color: TH.textSec,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}>
                    {"\""}{rtl ? tm.textAr : tm.textEn}{"\""}
                  </p>
                  <div style={{
                    fontWeight: 700,
                    color: TH.text,
                    fontSize: "0.9rem",
                  }}>{rtl ? tm.nameAr : tm.nameEn}</div>
                  <div style={{
                    color: TH.textSec,
                    fontSize: "0.8rem",
                  }}>{rtl ? tm.roleAr : tm.roleEn}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section style={{
        padding: "60px 20px",
        textAlign: "center",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
          borderRadius: "24px",
          padding: "48px 28px",
          maxWidth: "700px",
          margin: "0 auto",
        }}>
          <h2 style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "12px",
          }}>
            {rtl ? "مستعد تكتب محتوى يبهر العالم؟" : "Ready to Write Content That Wows?"}
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            marginBottom: "24px",
            fontSize: "1rem",
          }}>
            {rtl ? "10 كريديتس مجاناً. لا بطاقة ائتمان." : "10 free credits. No credit card needed."}
          </p>
          <button onClick={function () { user ? onNavigate("writer") : onLogin(); }} style={{
            background: "#fff",
            color: "#5B6CF0",
            border: "none",
            padding: "14px 40px",
            borderRadius: "12px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.25s",
          }}>
            {rtl ? "ابدأ دلوقتي" : "Get Started Now"}
          </button>
        </div>
      </section>
    </div>
  );
}
