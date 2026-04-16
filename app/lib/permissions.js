// ═══════════════════════════════════════════════════════════════════
// PERMISSIONS — Free vs Paid user rights
// Controls: watermark, copy, share, PDF access
// ═══════════════════════════════════════════════════════════════════

import { PLANS } from "../data/plans";

// ─── USER TIER DETECTION ──────────────────────────────────
export function getUserTier(profile) {
  if (!profile) return "guest";
  if (profile.is_admin) return "admin";
  const plan = profile.plan || "free";
  if (plan === "free") return "free";
  return "paid";
}

// ─── CAN COPY CONTENT? ────────────────────────────────────
export function canCopy(profile) {
  if (!profile) return false;
  if (profile.is_admin) return true;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.canCopy === true : false;
}

// ─── CAN SHARE CONTENT? ───────────────────────────────────
export function canShare(profile) {
  if (!profile) return false;
  if (profile.is_admin) return true;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.canShare === true : false;
}

// ─── HAS WATERMARK? (opposite of canCopy — free users see it) ──
export function hasWatermark(profile) {
  if (!profile) return true;
  if (profile.is_admin) return false;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.watermark === true : true;
}

// ─── WATERMARK TEXT ───────────────────────────────────────
export const WATERMARK_TEXT = "oxquill.com";

// ─── CAN ACCESS WRITERS DIRECTORY? ────────────────────────
export function canAccessDirectory(profile) {
  if (!profile) return false;
  if (profile.is_admin) return true;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.directory === true : false;
}

// ─── MAX WORDS ALLOWED ────────────────────────────────────
export function getMaxWords(profile) {
  if (!profile) return 800;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.mW : 800;
}

// ─── AVAILABLE LANGUAGES COUNT ────────────────────────────
export function getMaxLanguages(profile) {
  if (!profile) return 5;
  const plan = PLANS[profile.plan || "free"];
  return plan ? plan.lng : 5;
}

// ─── CSS STYLES FOR LOCKED (Free) CONTENT ─────────────────
export const LOCKED_CONTENT_STYLE = {
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  WebkitTouchCallout: "none",
  pointerEvents: "auto"
};

// ─── HANDLER: Prevent right-click on locked content ──────
export function preventRightClick(e) {
  e.preventDefault();
  return false;
}

// ─── HANDLER: Prevent copy on locked content ─────────────
export function preventCopy(e) {
  e.preventDefault();
  e.clipboardData.setData("text/plain", "Upgrade to Pro to copy content.");
  return false;
}

// ─── UPGRADE PROMPT MESSAGES ──────────────────────────────
export const UPGRADE_MESSAGES = {
  copy: {
    en: "Upgrade to copy content",
    ar: "ترقية للنسخ"
  },
  share: {
    en: "Upgrade to share",
    ar: "ترقية للمشاركة"
  },
  watermark: {
    en: "Upgrade to remove watermark",
    ar: "ترقية لإزالة العلامة المائية"
  },
  directory: {
    en: "Upgrade to access Writers Directory",
    ar: "ترقية للوصول لدليل الكتاب"
  }
};
