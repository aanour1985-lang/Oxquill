"use client";
import { useState, useEffect } from "react";

export default function CreditsView({
  darkMode, rtl, user, credits, onNavigate, showToast, t, TH, db
}) {
  var [transactions, setTransactions] = useState([]);

  useEffect(function () {
    if (db && user) {
      db.getCreditTransactions(user.id).then(function (txns) {
        if (txns) setTransactions(txns);
      });
    }
  }, [user]);

  var toolCosts = [
    { tool: "Generate Article", cost: 5, icon: "✍️" },
    { tool: "Roast", cost: 2, icon: "🔥" },
    { tool: "Viral Predictor", cost: 2, icon: "📊" },
    { tool: "Remix", cost: 3, icon: "🔄" },
    { tool: "Debate/Battle", cost: 6, icon: "⚔️" },
    { tool: "Summary", cost: 1, icon: "📝" },
    { tool: "Title Generator", cost: 1, icon: "💡" },
    { tool: "Twitter Thread", cost: 2, icon: "🧵" },
    { tool: "LinkedIn Post", cost: 2, icon: "💼" },
    { tool: "Repurpose", cost: 5, icon: "♻️" },
  ];

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
        borderRadius: "20px",
        padding: "32px",
        textAlign: "center",
        color: "#fff",
        marginBottom: "24px",
      }}>
        <div style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "8px" }}>
          {rtl ? "رصيدك الحالي" : "Current Balance"}
        </div>
        <div style={{ fontSize: "3rem", fontWeight: 800 }}>
          {credits} 🪙
        </div>
        <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "8px" }}>
          {rtl ? "كريديت" : "credits"}
        </div>
        <button onClick={function () { onNavigate("pricing"); }} style={{
          background: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.4)",
          color: "#fff",
          padding: "10px 28px",
          borderRadius: "10px",
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: "pointer",
          marginTop: "16px",
        }}>
          {rtl ? "اشتري كريديت" : "Buy Credits"}
        </button>
      </div>

      <div style={{
        background: TH.card,
        border: "1px solid " + TH.border,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "24px",
      }}>
        <h3 style={{
          color: TH.text,
          fontWeight: 700,
          fontSize: "1rem",
          marginBottom: "14px",
        }}>
          {rtl ? "تكلفة الأدوات" : "Tool Costs"}
        </h3>
        {toolCosts.map(function (tc, i) {
          return (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: i < toolCosts.length - 1 ? "1px solid " + TH.border : "none",
            }}>
              <span style={{ color: TH.text, fontSize: "0.9rem" }}>
                {tc.icon} {tc.tool}
              </span>
              <span style={{
                color: "#5B6CF0",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}>
                {tc.cost} 🪙
              </span>
            </div>
          );
        })}
      </div>

      <div>
        <h3 style={{
          color: TH.text,
          fontWeight: 700,
          fontSize: "1rem",
          marginBottom: "14px",
        }}>
          {rtl ? "سجل المعاملات" : "Transaction History"}
        </h3>
        {transactions.length === 0 ? (
          <p style={{ textAlign: "center", color: TH.textSec, padding: "24px" }}>
            {rtl ? "لا توجد معاملات بعد" : "No transactions yet"}
          </p>
        ) : (
          transactions.slice(0, 20).map(function (tx, i) {
            var isDebit = tx.amount < 0;
            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "6px",
                background: TH.card,
                border: "1px solid " + TH.border,
              }}>
                <div>
                  <div style={{ color: TH.text, fontSize: "0.85rem", fontWeight: 600 }}>
                    {tx.description || tx.tool || "Transaction"}
                  </div>
                  <div style={{ color: TH.textSec, fontSize: "0.75rem" }}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  color: isDebit ? "#EF4444" : "#22C55E",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}>
                  {isDebit ? "" : "+"}{tx.amount}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
