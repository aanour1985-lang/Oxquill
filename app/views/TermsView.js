"use client";
import { useState } from "react";

export default function TermsView({ darkMode, rtl, t, TH }) {
  var [tab, setTab] = useState("terms");

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "700px",
      margin: "0 auto",
    }}>
      <div style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginBottom: "32px",
      }}>
        {[
          { id: "terms", label: rtl ? "شروط الاستخدام" : "Terms of Service" },
          { id: "privacy", label: rtl ? "سياسة الخصوصية" : "Privacy Policy" },
        ].map(function (tb) {
          var active = tab === tb.id;
          return (
            <button key={tb.id}
              onClick={function () { setTab(tb.id); }}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: active ? "2px solid #5B6CF0" : "1px solid " + TH.border,
                background: active ? "rgba(91,108,240,0.1)" : "transparent",
                color: active ? "#5B6CF0" : TH.textSec,
                fontWeight: active ? 700 : 500,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}>
              {tb.label}
            </button>
          );
        })}
      </div>

      <div style={{
        background: TH.card,
        border: "1px solid " + TH.border,
        borderRadius: "16px",
        padding: "28px",
        color: TH.text,
        fontSize: "0.9rem",
        lineHeight: 1.8,
        direction: rtl ? "rtl" : "ltr",
      }}>
        {tab === "terms" ? (
          <>
            <h2 style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "20px",
            }}>
              {rtl ? "📜 شروط الاستخدام" : "📜 Terms of Service"}
            </h2>

            <p style={{ marginBottom: "16px" }}>
              {rtl
                ? "مرحباً بك في OxQuill. باستخدامك لمنصتنا، فإنك توافق على الشروط التالية:"
                : "Welcome to OxQuill. By using our platform, you agree to the following terms:"}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "1. الاستخدام المقبول" : "1. Acceptable Use"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "تلتزم باستخدام المنصة لأغراض مشروعة فقط. يمنع توليد محتوى مخالف للقانون أو محتوى كراهية أو محتوى يضر بالآخرين."
                : "You agree to use the platform for lawful purposes only. Generating illegal, hateful, or harmful content is prohibited."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "2. المحتوى المُولَّد" : "2. Generated Content"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "المحتوى المولد بواسطة AI يخصك أنت. تتحمل مسؤولية مراجعته قبل النشر."
                : "AI-generated content belongs to you. You are responsible for reviewing it before publishing."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "3. الكريديت والدفع" : "3. Credits & Payment"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "الكريديت غير قابل للاسترداد. الاشتراكات تتجدد تلقائياً ويمكن إلغاؤها في أي وقت."
                : "Credits are non-refundable. Subscriptions auto-renew and can be cancelled anytime."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "4. إخلاء المسؤولية" : "4. Disclaimer"}
            </h3>
            <p style={{ color: TH.textSec }}>
              {rtl
                ? "المنصة مقدمة \"كما هي\". لا نضمن دقة المحتوى المولد أو ملاءمته لأي غرض محدد."
                : "The platform is provided \"as is.\" We do not guarantee accuracy or suitability of generated content for any specific purpose."}
            </p>
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "20px",
            }}>
              {rtl ? "🔒 سياسة الخصوصية" : "🔒 Privacy Policy"}
            </h2>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", color: "#5B6CF0" }}>
              {rtl ? "1. البيانات التي نجمعها" : "1. Data We Collect"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "الاسم والبريد الإلكتروني عند التسجيل. المحتوى المولد يُحفظ في حسابك."
                : "Name and email upon registration. Generated content is stored in your account."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "2. كيف نستخدم بياناتك" : "2. How We Use Your Data"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "لتقديم الخدمة وتحسينها. لا نبيع أو نشارك بياناتك مع أطراف ثالثة."
                : "To provide and improve our service. We never sell or share your data with third parties."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "3. الأمان" : "3. Security"}
            </h3>
            <p style={{ color: TH.textSec, marginBottom: "12px" }}>
              {rtl
                ? "نستخدم تشفير SSL وأفضل الممارسات لحماية بياناتك."
                : "We use SSL encryption and industry best practices to protect your data."}
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: "20px", color: "#5B6CF0" }}>
              {rtl ? "4. حقوقك" : "4. Your Rights"}
            </h3>
            <p style={{ color: TH.textSec }}>
              {rtl
                ? "يمكنك طلب حذف حسابك وبياناتك في أي وقت عبر صفحة التواصل."
                : "You can request deletion of your account and data at any time through our contact page."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
