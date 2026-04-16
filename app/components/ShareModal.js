// ═══════════════════════════════════════════════════════════════════
// SHARE MODAL — Multiple sharing options for paid users
// Options: Copy Link, Email, X (Twitter), LinkedIn, Facebook, PDF
// Props: article, onClose, rtl, t, onCopyLink, onSharePDF
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";

function ShareButton({ icon, label, onClick, bg, color }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "14px 10px",
        background: hover ? bg : "var(--bg)",
        border: "1px solid " + (hover ? "transparent" : "var(--bd)"),
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
        transform: pressed ? "scale(0.96)" : hover ? "scale(1.04)" : "scale(1)",
        boxShadow: hover ? "0 8px 20px rgba(0,0,0,.1)" : "none",
        color: hover ? color : "var(--tx)",
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 600,
        outline: "none",
        width: "100%"
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: hover ? color : bg,
          display: "grid",
          placeItems: "center",
          transition: "all 0.2s",
          color: hover ? "#fff" : color
        }}
      >
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

export default function ShareModal(props) {
  const { article, onClose, rtl, t } = props;
  const [copied, setCopied] = useState(false);

  const articleUrl = typeof window !== "undefined"
    ? `${window.location.origin}/article/${article?.id || ""}`
    : "";

  function handleCopyLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function handleEmail() {
    const subject = encodeURIComponent(article?.topic || "Article from Oxquill");
    const body = encodeURIComponent(`Check out this article:\n\n${articleUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function handleTwitter() {
    const text = encodeURIComponent(article?.topic || "");
    const url = encodeURIComponent(articleUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }

  function handleLinkedIn() {
    const url = encodeURIComponent(articleUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  }

  function handleFacebook() {
    const url = encodeURIComponent(articleUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  function handlePDF() {
    if (props.onSharePDF) props.onSharePDF();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: 16,
        direction: rtl ? "rtl" : "ltr",
        animation: "fadeIn 0.2s"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--overlay)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)"
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          background: "var(--cd)",
          borderRadius: 16,
          padding: 26,
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
          animation: "modalIn 0.25s cubic-bezier(.4,0,.2,1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 20,
              fontWeight: 900,
              color: "var(--tx)",
              marginBottom: 4
            }}
          >
            {t("share.title")}
          </div>
          {article?.topic && (
            <div style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.5 }}>
              {article.topic.slice(0, 60)}{article.topic.length > 60 ? "..." : ""}
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--bg)",
            border: "1.5px solid var(--bd)",
            borderRadius: 10,
            padding: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 11,
              color: "var(--t2)",
              wordBreak: "break-all",
              fontFamily: "monospace"
            }}
          >
            {articleUrl}
          </div>
          <button
            onClick={handleCopyLink}
            style={{
              padding: "7px 14px",
              background: copied ? "var(--ok)" : "var(--pr)",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
              outline: "none",
              whiteSpace: "nowrap"
            }}
          >
            {copied ? t("toast.copied") : t("share.link")}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: 10
          }}
        >
          <ShareButton
            label={t("share.email")}
            onClick={handleEmail}
            bg="rgba(91,108,240,.08)"
            color="#5B6CF0"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
          />
          <ShareButton
            label={t("share.twitter")}
            onClick={handleTwitter}
            bg="rgba(0,0,0,.05)"
            color="#000"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            }
          />
          <ShareButton
            label={t("share.linkedin")}
            onClick={handleLinkedIn}
            bg="rgba(10,102,194,.1)"
            color="#0A66C2"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
            }
          />
          <ShareButton
            label={t("share.facebook")}
            onClick={handleFacebook}
            bg="rgba(24,119,242,.1)"
            color="#1877F2"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            }
          />
          <ShareButton
            label={t("share.pdf")}
            onClick={handlePDF}
            bg="rgba(212,69,60,.08)"
            color="#D4453C"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            }
          />
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 18,
            padding: 11,
            background: "var(--b3)",
            color: "var(--tx)",
            border: "1px solid var(--bd)",
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            outline: "none",
            transition: "background 0.18s"
          }}
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
}
