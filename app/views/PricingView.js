"use client";

export default function PricingView({
  darkMode, rtl, user, onNavigate, onLogin, showToast, t, TH, PLANS
}) {
  var plans = PLANS || [
    { id: "free", name: "Free", price: 0, credits: 10, words: 800, languages: 5, watermark: true, canCopy: false, canShare: false, features: ["10 credits/mo", "800 words max", "5 languages", "Watermark on exports"] },
    { id: "starter", name: "Starter", price: 19, credits: 100, words: 2000, languages: 28, watermark: false, canCopy: true, canShare: true, features: ["100 credits/mo", "2000 words max", "28 languages", "No watermark", "Copy & Share"] },
    { id: "pro", name: "Pro", price: 49, credits: 500, words: 5000, languages: 28, watermark: false, canCopy: true, canShare: true, popular: true, features: ["500 credits/mo", "5000 words max", "All tools", "Writers Directory", "Priority support"] },
    { id: "agency", name: "Agency", price: 99, credits: 2000, words: 5000, languages: 28, watermark: false, canCopy: true, canShare: true, features: ["2000 credits/mo", "Unlimited words", "All tools", "API access", "White label"] },
  ];

  var creditPacks = [
    { credits: 10, price: 5, label: "Starter Pack" },
    { credits: 50, price: 20, label: "Writer Pack" },
    { credits: 200, price: 60, label: "Pro Pack", badge: rtl ? "الأفضل" : "Best Value" },
    { credits: 500, price: 120, label: "Agency Pack" },
  ];

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "900px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: TH.text,
        }}>
          {rtl ? "💎 اختر خطتك" : "💎 Choose Your Plan"}
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginBottom: "48px",
      }}>
        {plans.map(function (plan, i) {
          var isPopular = plan.popular;
          return (
            <div key={i} style={{
              background: TH.card,
              border: isPopular ? "2px solid #5B6CF0" : "1px solid " + TH.border,
              borderRadius: "18px",
              padding: "28px 20px",
              textAlign: "center",
              position: "relative",
              transition: "all 0.25s",
            }}>
              {isPopular && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
                  color: "#fff",
                  padding: "4px 16px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}>
                  {rtl ? "⭐ الأشهر" : "⭐ Popular"}
                </div>
              )}

              <h3 style={{
                color: TH.text,
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "8px",
              }}>{plan.name}</h3>

              <div style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#5B6CF0",
                marginBottom: "4px",
              }}>
                {plan.price === 0 ? (rtl ? "مجاني" : "Free") : "$" + plan.price}
              </div>
              {plan.price > 0 && (
                <div style={{ color: TH.textSec, fontSize: "0.8rem", marginBottom: "16px" }}>
                  /{rtl ? "شهر" : "month"}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                {(plan.features || []).map(function (feat, j) {
                  return (
                    <div key={j} style={{
                      color: TH.textSec,
                      fontSize: "0.8rem",
                      padding: "4px 0",
                    }}>
                      ✓ {feat}
                    </div>
                  );
                })}
              </div>

              <button onClick={function () { user ? showToast(rtl ? "قريباً!" : "Coming soon!", "info") : onLogin(); }} style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: isPopular ? "none" : "1px solid " + TH.border,
                background: isPopular ? "linear-gradient(135deg, #5B6CF0, #9B7BF0)" : "transparent",
                color: isPopular ? "#fff" : TH.text,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}>
                {plan.price === 0
                  ? (rtl ? "ابدأ مجاناً" : "Start Free")
                  : (rtl ? "اشترك" : "Subscribe")}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: TH.text,
        }}>
          {rtl ? "🪙 باقات الكريديت" : "🪙 Credit Packs"}
        </h2>
        <p style={{ color: TH.textSec, fontSize: "0.9rem", marginTop: "8px" }}>
          {rtl ? "اشتري كريديت إضافي وقتما تحتاج" : "Buy extra credits whenever you need"}
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
      }}>
        {creditPacks.map(function (pack, i) {
          return (
            <div key={i} style={{
              background: TH.card,
              border: pack.badge ? "2px solid #F59E0B" : "1px solid " + TH.border,
              borderRadius: "14px",
              padding: "20px",
              textAlign: "center",
              position: "relative",
            }}>
              {pack.badge && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  right: "12px",
                  background: "#F59E0B",
                  color: "#fff",
                  padding: "2px 10px",
                  borderRadius: "8px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}>{pack.badge}</div>
              )}
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>
                {pack.credits} 🪙
              </div>
              <div style={{ color: TH.textSec, fontSize: "0.8rem", margin: "6px 0 12px" }}>
                {pack.label}
              </div>
              <button onClick={function () { showToast(rtl ? "قريباً!" : "Coming soon!", "info"); }} style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "#F59E0B",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}>
                ${pack.price}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
