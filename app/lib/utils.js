// ═══════════════════════════════════════════════════════════════════
// UTILITIES — Helpers for content, exports, AI calls
// ═══════════════════════════════════════════════════════════════════

// ─── MARKDOWN TO HTML ─────────────────────────────────────
export function md2h(t) {
  if (!t) return "";
  return t
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

// ─── EXPORT TO PDF (with optional watermark) ──────────────
export function exPDF(content, title, watermark) {
  const w = window.open("");
  const watermarkCSS = watermark
    ? `body::before {
        content: "${watermark}";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px;
        color: rgba(91, 108, 240, 0.08);
        font-weight: 900;
        pointer-events: none;
        z-index: -1;
      }`
    : "";
  w.document.write(`<html><head><title>${title}</title>
    <style>
      body{font-family:Georgia;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;position:relative}
      h1{font-size:26px}
      h2{font-size:20px}
      ${watermarkCSS}
      @media print{body{margin:0}}
    </style></head><body>${md2h(content)}</body></html>`);
  w.document.close();
  setTimeout(function() { w.print(); }, 500);
}

// ─── EXPORT TO WORD (.doc) ────────────────────────────────
export function exWord(content, title) {
  const b = new Blob(
    [
      "<html><head><meta charset='utf-8'></head><body>" +
        md2h(content) +
        "</body></html>"
    ],
    { type: "application/msword" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = (title || "article").slice(0, 30) + ".doc";
  a.click();
}

// ─── EXPORT TO TXT ────────────────────────────────────────
export function exTXT(content, title) {
  const b = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = (title || "article").slice(0, 30) + ".txt";
  a.click();
}

// ─── CALL CLAUDE API ──────────────────────────────────────
export async function callAI(prompt) {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await res.json();
    let text = "";
    if (data.content) {
      for (let i = 0; i < data.content.length; i++) {
        text += data.content[i].text || "";
      }
    }
    return text || data.error || "Error generating content.";
  } catch (e) {
    return "Network error. Please try again.";
  }
}

// ─── ARTICLE CSS STYLING ──────────────────────────────────
export const articleStyle = ".ax h1{font-family:Source Serif 4,Georgia,serif;font-size:24px;font-weight:900;color:var(--tx);margin-bottom:10px}.ax h2{font-family:Source Serif 4,Georgia,serif;font-size:19px;font-weight:700;color:var(--tx);margin-top:24px;margin-bottom:10px}.ax h3{font-size:16px;font-weight:700;color:var(--tx);margin-top:16px;margin-bottom:6px}.ax p{margin-bottom:14px}.ax strong{color:var(--tx)}.ax ul,.ax ol{margin:12px 0;padding-inline-start:22px}.ax li{margin-bottom:6px}.ax em{color:var(--p2);font-style:italic}";

// ─── COPY TO CLIPBOARD (with permission check) ────────────
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

// ─── SHARE LINK (generates shareable URL) ─────────────────
export function buildShareUrl(articleId) {
  if (typeof window === "undefined") return "";
  return window.location.origin + "/article/" + articleId;
}

// ─── FORMAT DATE (relative: "2 hours ago") ────────────────
export function timeAgo(dateString, rtl) {
  const now = new Date();
  const then = new Date(dateString);
  const seconds = Math.floor((now - then) / 1000);

  if (rtl) {
    if (seconds < 60) return "الآن";
    if (seconds < 3600) return Math.floor(seconds / 60) + " دقيقة";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " ساعة";
    if (seconds < 2592000) return Math.floor(seconds / 86400) + " يوم";
    return Math.floor(seconds / 2592000) + " شهر";
  }
  if (seconds < 60) return "now";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
  if (seconds < 2592000) return Math.floor(seconds / 86400) + "d ago";
  return Math.floor(seconds / 2592000) + "mo ago";
}
