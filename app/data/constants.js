// ═══════════════════════════════════════════════════════════════════
// CONSTANTS — Static data arrays
// Used across Writer, Landing, Pricing, etc.
// ═══════════════════════════════════════════════════════════════════

// ─── 28 LANGUAGES ─────────────────────────────────────────
export const LANGS = [
  { v: "en", l: "English" },
  { v: "ar", l: "العربية" },
  { v: "fr", l: "Francais" },
  { v: "es", l: "Espanol" },
  { v: "de", l: "Deutsch" },
  { v: "it", l: "Italiano" },
  { v: "pt", l: "Portugues" },
  { v: "tr", l: "Turkce" },
  { v: "ru", l: "Russian" },
  { v: "ja", l: "Japanese" },
  { v: "zh", l: "Chinese" },
  { v: "hi", l: "Hindi" },
  { v: "nl", l: "Dutch" },
  { v: "pl", l: "Polski" },
  { v: "sv", l: "Svenska" },
  { v: "th", l: "Thai" },
  { v: "vi", l: "Vietnamese" },
  { v: "id", l: "Bahasa" },
  { v: "ko", l: "Korean" },
  { v: "he", l: "Hebrew" },
  { v: "el", l: "Greek" },
  { v: "cs", l: "Czech" },
  { v: "da", l: "Danish" },
  { v: "fi", l: "Finnish" },
  { v: "no", l: "Norsk" },
  { v: "ro", l: "Romanian" },
  { v: "uk", l: "Ukrainian" },
  { v: "ms", l: "Melayu" }
];

// ─── 8 TONES ──────────────────────────────────────────────
export const TONES = [
  "Professional",
  "Casual",
  "Academic",
  "Creative",
  "Persuasive",
  "Storytelling",
  "Friendly",
  "Authoritative"
];

// ─── 6 MOODS ──────────────────────────────────────────────
export const MOODS = [
  { e: "H", n: "Happy", p: "upbeat and positive" },
  { e: "E", n: "Emotional", p: "touching and heartfelt" },
  { e: "P", n: "Passionate", p: "bold and assertive" },
  { e: "T", n: "Thoughtful", p: "reflective and deep" },
  { e: "C", n: "Confident", p: "cool and assured" },
  { e: "F", n: "Humorous", p: "funny and witty" }
];

// ─── 31 ERAS (Vintage + Modern + Future) ──────────────────
function buildEras() {
  const vintage = [];
  for (let y = 1900; y <= 1945; y += 5) {
    vintage.push({ y: String(y), p: y + "s vintage formal prose" });
  }
  const modern = [];
  for (let y = 1950; y <= 2020; y += 5) {
    modern.push({ y: String(y), p: y + "s modern style" });
  }
  const future = [];
  for (let y = 2025; y <= 2050; y += 5) {
    future.push({ y: String(y), p: "futuristic " + y + " style" });
  }
  return { vintage, modern, future };
}

const ERAS_BUILT = buildEras();
export const ERAS_VINTAGE = ERAS_BUILT.vintage;
export const ERAS_MODERN = ERAS_BUILT.modern;
export const ERAS_FUTURE = ERAS_BUILT.future;

// ─── 6 TEMPLATES ──────────────────────────────────────────
export const TMPLS = [
  { id: "blog", n: "Blog", p: "a blog article" },
  { id: "list", n: "Listicle", p: "a listicle" },
  { id: "how", n: "How-To", p: "a how-to guide" },
  { id: "comp", n: "Compare", p: "a comparison" },
  { id: "rev", n: "Review", p: "a review" },
  { id: "news", n: "News", p: "a news article" }
];

// ─── COSTS per action (in credits) ────────────────────────
export const COSTS = {
  generate: 5,
  roast: 2,
  viral: 2,
  remix: 3,
  debate: 6,
  summary: 1,
  titles: 1,
  thread: 2,
  linkedin: 2,
  repurpose: 5,
  battle: 4
};

// ─── 6 CONTACT MESSAGE TYPES ──────────────────────────────
export const CONTACT_TYPES = [
  { id: "suggest", n: { en: "Suggestion", ar: "اقتراح" } },
  { id: "question", n: { en: "Question", ar: "سؤال" } },
  { id: "complaint", n: { en: "Complaint", ar: "شكوى" } },
  { id: "collab", n: { en: "Collaboration", ar: "تعاون" } },
  { id: "business", n: { en: "Business", ar: "تجاري" } },
  { id: "technical", n: { en: "Technical", ar: "تقني" } }
];
