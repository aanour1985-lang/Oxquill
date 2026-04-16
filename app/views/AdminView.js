"use client";
import { useState, useEffect } from "react";

export default function AdminView({
  darkMode, rtl, user, showToast, t, TH, db
}) {
  var [tab, setTab] = useState("dashboard");
  var [users, setUsers] = useState([]);
  var [messages, setMessages] = useState([]);
  var [stats, setStats] = useState({ totalUsers: 0, totalArticles: 0, totalCreditsUsed: 0 });
  var [apiUsage, setApiUsage] = useState({
    monthlyTokens: 0,
    estimatedCost: 0,
    balance: 5.00,
    lastUpdated: new Date().toISOString(),
  });
  var [balanceInput, setBalanceInput] = useState("");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    if (!db) return;
    try {
      var allUsers = await db.getAllUsers();
      if (allUsers) setUsers(allUsers);
      var allMsgs = await db.getMessages();
      if (allMsgs) setMessages(allMsgs);
      var s = await db.getStats();
      if (s) setStats(s);
      var usage = await db.getApiUsage();
      if (usage) setApiUsage(usage);
    } catch (e) {
      console.error("Admin load error:", e);
    }
  }

  async function toggleBan(userId, currentBanned) {
    if (!db) return;
    await db.updateUser(userId, { banned: !currentBanned });
    showToast(
      currentBanned
        ? (rtl ? "تم فك الحظر" : "User unbanned")
        : (rtl ? "تم الحظر" : "User banned"),
      "success"
    );
    loadData();
  }

  async function toggleAdmin(userId, currentAdmin) {
    if (!db) return;
    await db.updateUser(userId, { is_admin: !currentAdmin });
    showToast(
      currentAdmin
        ? (rtl ? "تم إزالة الأدمن" : "Admin removed")
        : (rtl ? "تم إضافة أدمن" : "Admin added"),
      "success"
    );
    loadData();
  }

  async function markMessageRead(msgId) {
    if (!db) return;
    await db.updateMessage(msgId, { status: "read" });
    loadData();
  }

  function updateBalance() {
    var val = parseFloat(balanceInput);
    if (isNaN(val) || val < 0) {
      showToast(rtl ? "أدخل رقم صحيح" : "Enter a valid number", "error");
      return;
    }
    setApiUsage(function (prev) {
      return Object.assign({}, prev, { balance: val, lastUpdated: new Date().toISOString() });
    });
    if (db) db.updateApiUsage({ balance: val });
    setBalanceInput("");
    showToast(rtl ? "تم تحديث الرصيد" : "Balance updated", "success");
  }

  var tabs = [
    { id: "dashboard", label: rtl ? "لوحة التحكم" : "Dashboard", icon: "📊" },
    { id: "users", label: rtl ? "المستخدمين" : "Users", icon: "👥" },
    { id: "admins", label: rtl ? "الأدمنز" : "Admins", icon: "🛡️" },
    { id: "messages", label: rtl ? "الرسائل" : "Messages", icon: "📩" },
  ];

  var newMsgCount = messages.filter(function (m) { return m.status === "new"; }).length;

  var typeBadge = function (type) {
    var colors = {
      suggestion: "#3B82F6", question: "#8B5CF6", complaint: "#EF4444",
      collaboration: "#22C55E", business: "#F59E0B", technical: "#6366F1",
    };
    return {
      padding: "3px 10px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: 600,
      background: (colors[type] || "#888") + "20",
      color: colors[type] || "#888",
    };
  };

  return (
    <div style={{
      padding: "80px 16px 40px",
      maxWidth: "900px",
      margin: "0 auto",
    }}>
      <h1 style={{
        fontFamily: "'Source Serif 4', serif",
        fontSize: "1.6rem",
        fontWeight: 700,
        color: TH.text,
        marginBottom: "24px",
        textAlign: "center",
      }}>
        🛡️ {rtl ? "لوحة الأدمن" : "Admin Panel"}
      </h1>

      <div style={{
        display: "flex",
        gap: "6px",
        marginBottom: "24px",
        overflowX: "auto",
      }}>
        {tabs.map(function (tb) {
          var active = tab === tb.id;
          return (
            <button key={tb.id}
              onClick={function () { setTab(tb.id); }}
              style={{
                flex: 1,
                padding: "10px 6px",
                borderRadius: "10px",
                border: active ? "2px solid #5B6CF0" : "1px solid " + TH.border,
                background: active ? "rgba(91,108,240,0.1)" : "transparent",
                color: active ? "#5B6CF0" : TH.textSec,
                fontWeight: active ? 700 : 500,
                fontSize: "0.8rem",
                cursor: "pointer",
                position: "relative",
                whiteSpace: "nowrap",
              }}>
              {tb.icon} {tb.label}
              {tb.id === "messages" && newMsgCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px", right: "-2px",
                  background: "#EF4444",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "10px",
                  minWidth: "16px",
                  textAlign: "center",
                }}>{newMsgCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "dashboard" && (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}>
            {[
              { label: rtl ? "المستخدمين" : "Users", value: stats.totalUsers || users.length, icon: "👥", color: "#3B82F6" },
              { label: rtl ? "المقالات" : "Articles", value: stats.totalArticles || 0, icon: "📄", color: "#22C55E" },
              { label: rtl ? "كريديت مستهلك" : "Credits Used", value: stats.totalCreditsUsed || 0, icon: "💰", color: "#F59E0B" },
              { label: rtl ? "الرسائل الجديدة" : "New Messages", value: newMsgCount, icon: "📩", color: "#EF4444" },
            ].map(function (s, i) {
              return (
                <div key={i} style={{
                  background: TH.card,
                  border: "1px solid " + TH.border,
                  borderRadius: "14px",
                  padding: "20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.8rem", color: TH.textSec }}>{s.label}</div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: TH.card,
            border: "1px solid " + TH.border,
            borderRadius: "16px",
            padding: "24px",
          }}>
            <h3 style={{
              color: TH.text,
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "16px",
            }}>
              🤖 {rtl ? "استهلاك Claude API" : "Claude API Usage"}
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}>
              <div style={{
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <div style={{ color: TH.textSec, fontSize: "0.8rem", marginBottom: "4px" }}>
                  {rtl ? "توكنز هذا الشهر" : "Monthly Tokens"}
                </div>
                <div style={{ color: TH.text, fontWeight: 700, fontSize: "1.1rem" }}>
                  {apiUsage.monthlyTokens.toLocaleString()}
                </div>
              </div>
              <div style={{
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "10px",
                padding: "14px",
              }}>
                <div style={{ color: TH.textSec, fontSize: "0.8rem", marginBottom: "4px" }}>
                  {rtl ? "التكلفة المقدرة" : "Est. Cost"}
                </div>
                <div style={{ color: TH.text, fontWeight: 700, fontSize: "1.1rem" }}>
                  ${apiUsage.estimatedCost.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{
              background: apiUsage.balance < 2
                ? "rgba(239,68,68,0.08)"
                : apiUsage.balance < 5
                  ? "rgba(245,158,11,0.08)"
                  : "rgba(34,197,94,0.08)",
              borderRadius: "10px",
              padding: "14px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                  {rtl ? "رصيد Anthropic" : "Anthropic Balance"}
                </div>
                <div style={{
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  color: apiUsage.balance < 2 ? "#EF4444" : apiUsage.balance < 5 ? "#F59E0B" : "#22C55E",
                }}>
                  ${apiUsage.balance.toFixed(2)}
                </div>
              </div>
              {apiUsage.balance < 2 && (
                <span style={{
                  background: "#EF4444",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}>
                  ⚠️ {rtl ? "رصيد منخفض!" : "LOW!"}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={balanceInput}
                onChange={function (e) { setBalanceInput(e.target.value); }}
                placeholder="$"
                type="number"
                step="0.01"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid " + TH.border,
                  background: TH.card,
                  color: TH.text,
                  fontSize: "0.9rem",
                }}
              />
              <button onClick={updateBalance} style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: "#5B6CF0",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}>
                {rtl ? "تحديث" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div>
          {users.length === 0 ? (
            <p style={{ textAlign: "center", color: TH.textSec, padding: "32px" }}>
              {rtl ? "لا يوجد مستخدمين" : "No users yet"}
            </p>
          ) : (
            users.map(function (u, i) {
              return (
                <div key={i} style={{
                  background: TH.card,
                  border: "1px solid " + TH.border,
                  borderRadius: "12px",
                  padding: "14px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: u.banned ? 0.5 : 1,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: TH.text, fontSize: "0.9rem" }}>
                      {u.name || u.email}
                      {u.is_admin && <span style={{ color: "#5B6CF0", marginLeft: "6px" }}>🛡️</span>}
                      {u.banned && <span style={{ color: "#EF4444", marginLeft: "6px" }}>🚫</span>}
                    </div>
                    <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={function () { toggleBan(u.id, u.banned); }} style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid " + (u.banned ? "#22C55E" : "#EF4444"),
                      background: "transparent",
                      color: u.banned ? "#22C55E" : "#EF4444",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}>
                      {u.banned ? "✓ Unban" : "🚫 Ban"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "admins" && (
        <div>
          {users.filter(function (u) { return u.is_admin; }).map(function (u, i) {
            return (
              <div key={i} style={{
                background: TH.card,
                border: "1px solid " + TH.border,
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: TH.text }}>{u.name || u.email} 🛡️</div>
                  <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>{u.email}</div>
                </div>
                {u.email !== "aanour1985@gmail.com" && (
                  <button onClick={function () { toggleAdmin(u.id, true); }} style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #EF4444",
                    background: "transparent",
                    color: "#EF4444",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}>
                    {rtl ? "إزالة" : "Remove"}
                  </button>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: "20px" }}>
            <p style={{ color: TH.textSec, fontSize: "0.85rem", marginBottom: "8px" }}>
              {rtl ? "إضافة أدمن (من المستخدمين الحاليين):" : "Add admin (from existing users):"}
            </p>
            {users.filter(function (u) { return !u.is_admin; }).map(function (u, i) {
              return (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                }}>
                  <span style={{ color: TH.text, fontSize: "0.85rem" }}>{u.name || u.email}</span>
                  <button onClick={function () { toggleAdmin(u.id, false); }} style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: "1px solid #5B6CF0",
                    background: "transparent",
                    color: "#5B6CF0",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}>
                    + {rtl ? "أدمن" : "Admin"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: TH.textSec, padding: "32px" }}>
              {rtl ? "لا يوجد رسائل" : "No messages yet"}
            </p>
          ) : (
            messages.map(function (msg, i) {
              var isNew = msg.status === "new";
              return (
                <div key={i} style={{
                  background: TH.card,
                  border: "1px solid " + (isNew ? "#5B6CF0" : TH.border),
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "10px",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={typeBadge(msg.type)}>{msg.type}</span>
                      {isNew && (
                        <span style={{
                          background: "#5B6CF0",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}>NEW</span>
                      )}
                    </div>
                    <span style={{ color: TH.textSec, fontSize: "0.75rem" }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, color: TH.text, fontSize: "0.95rem", marginBottom: "6px" }}>
                    {msg.subject}
                  </div>
                  <p style={{
                    color: TH.textSec,
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    marginBottom: "8px",
                  }}>
                    {msg.message}
                  </p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                      ✉️ {msg.email || msg.sender_email}
                    </span>
                    {isNew && (
                      <button onClick={function () { markMessageRead(msg.id); }} style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        border: "1px solid #22C55E",
                        background: "transparent",
                        color: "#22C55E",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}>
                        ✓ {rtl ? "تم القراءة" : "Mark Read"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
