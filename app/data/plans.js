// ═══════════════════════════════════════════════════════════════════
// PLANS & GAMIFICATION
// Pricing plans, credit packs, levels, badges
// ═══════════════════════════════════════════════════════════════════

// ─── CREDIT PACKS (one-time) ──────────────────────────────
export const PACKS = [
  { credits: 10, price: 5, label: "Starter" },
  { credits: 50, price: 20, label: "Creator", save: "20%" },
  { credits: 200, price: 60, label: "Power", best: true, save: "40%" },
  { credits: 500, price: 120, label: "Agency", save: "52%" }
];

// ─── 4 SUBSCRIPTION PLANS ─────────────────────────────────
export const PLANS = {
  free: {
    n: "Free",
    pr: 0,
    cr: 10,
    mW: 800,
    lng: 5,
    directory: false,
    watermark: true,
    canCopy: false,
    canShare: false,
    f: [
      "10 credits/month",
      "800 words max",
      "5 languages",
      "Watermark on articles",
      "Basic support"
    ]
  },
  starter: {
    n: "Starter",
    pr: 19,
    cr: 100,
    mW: 2000,
    lng: 28,
    directory: false,
    watermark: false,
    canCopy: true,
    canShare: true,
    f: [
      "100 credits/month",
      "2000 words max",
      "28 languages",
      "No watermark",
      "Copy & share",
      "Email support",
      "All AI tools"
    ]
  },
  pro: {
    n: "Pro",
    pr: 49,
    cr: 500,
    mW: 5000,
    lng: 28,
    directory: true,
    watermark: false,
    canCopy: true,
    canShare: true,
    pop: true,
    f: [
      "500 credits/month",
      "5000 words max",
      "28 languages",
      "No watermark",
      "Copy & share",
      "Priority support",
      "Writers Directory",
      "PDF/Word export"
    ]
  },
  agency: {
    n: "Agency",
    pr: 99,
    cr: 2000,
    mW: 5000,
    lng: 28,
    directory: true,
    watermark: false,
    canCopy: true,
    canShare: true,
    f: [
      "2000 credits/month",
      "5000 words max",
      "28 languages",
      "No watermark",
      "Copy & share",
      "Dedicated support",
      "Writers Directory",
      "White-label",
      "Team seats"
    ]
  }
};

// ─── 10 GAMIFICATION LEVELS ───────────────────────────────
export const LEVELS = [
  { lv: 1, n: "Beginner", xp: 0, goal: "Write your first article", reward: "+5 credits" },
  { lv: 2, n: "Writer", xp: 100, goal: "Write 5 articles", reward: "+10 credits" },
  { lv: 3, n: "Author", xp: 300, goal: "3-day streak", reward: "New templates" },
  { lv: 4, n: "Editor", xp: 600, goal: "Write 10,000 words", reward: "+15 credits" },
  { lv: 5, n: "Expert", xp: 1000, goal: "Win 3 battles", reward: "Premium badge" },
  { lv: 6, n: "Master", xp: 2000, goal: "Write in 5 languages", reward: "+25 credits" },
  { lv: 7, n: "Legend", xp: 3500, goal: "30-day streak", reward: "Exclusive templates" },
  { lv: 8, n: "Sage", xp: 5500, goal: "Write 100 articles", reward: "+50 credits" },
  { lv: 9, n: "Virtuoso", xp: 8000, goal: "Write 50,000 words", reward: "Lifetime discount" },
  { lv: 10, n: "Elite", xp: 12000, goal: "Ultimate mastery", reward: "VIP status" }
];

// ─── 10 EARNABLE BADGES ───────────────────────────────────
export const BADGES = [
  { id: "first", n: "First Article", ic: "1", req: 1, t: "art" },
  { id: "ten", n: "10 Articles", ic: "10", req: 10, t: "art" },
  { id: "fifty", n: "50 Club", ic: "50", req: 50, t: "art" },
  { id: "hundred", n: "Centurion", ic: "100", req: 100, t: "art" },
  { id: "s3", n: "3-Day Streak", ic: "3d", req: 3, t: "str" },
  { id: "s7", n: "Week Warrior", ic: "7d", req: 7, t: "str" },
  { id: "s30", n: "Monthly Master", ic: "30d", req: 30, t: "str" },
  { id: "w1k", n: "1K Words", ic: "1K", req: 1000, t: "wrd" },
  { id: "w10k", n: "10K Words", ic: "10K", req: 10000, t: "wrd" },
  { id: "w50k", n: "50K Words", ic: "50K", req: 50000, t: "wrd" }
];
