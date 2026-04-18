"use client";
import { useState, useEffect, useRef } from "react";

/* =============================================
   OxQuill V2.2 — Complete Single File
   All 18 modifications included
   ============================================= */

var LIGHT = {
  bg: "#FAFAFA", text: "#1A1A2E", textSec: "#6B7280",
  card: "#FFFFFF", border: "#E5E7EB",
  primary: "#5B6CF0", secondary: "#9B7BF0",
};
var DARK = {
  bg: "#0F0F1A", text: "#F1F1F1", textSec: "#9CA3AF",
  card: "#1A1A2E", border: "#2D2D44",
  primary: "#7B8AF5", secondary: "#B89FF5",
};

var safeDb = null;
try { safeDb = require("./lib/db"); } catch (e) {}
var safeSupa = null;
try { safeSupa = require("./lib/supabase").supabase; } catch (e) {}

/* ============ #7 i18n COMPLETE — 90+ KEYS ============ */
var I18N = {
  home: { en: "Home", ar: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629" },
  writer: { en: "AI Writer", ar: "\u0643\u0627\u062a\u0628 AI" },
  roast: { en: "Roast", ar: "\u0627\u0644\u0646\u0642\u062f" },
  battle: { en: "Battle", ar: "\u0627\u0644\u0645\u0639\u0631\u0643\u0629" },
  writers: { en: "Writers", ar: "\u0627\u0644\u0643\u062a\u0627\u0628" },
  pricing: { en: "Pricing", ar: "\u0627\u0644\u0628\u0627\u0642\u0627\u062a" },
  credits: { en: "Credits", ar: "\u0627\u0644\u0643\u0631\u064a\u062f\u062a" },
  profile: { en: "Profile", ar: "\u0627\u0644\u0645\u0644\u0641" },
  contact: { en: "Contact", ar: "\u062a\u0648\u0627\u0635\u0644" },
  terms: { en: "Terms", ar: "\u0627\u0644\u0634\u0631\u0648\u0637" },
  admin: { en: "Admin", ar: "\u0627\u0644\u0625\u062f\u0627\u0631\u0629" },
  login: { en: "Login", ar: "\u062f\u062e\u0648\u0644" },
  logout: { en: "Logout", ar: "\u062e\u0631\u0648\u062c" },
  signup: { en: "Sign Up", ar: "\u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f" },
  start: { en: "Start Writing Free", ar: "\u0627\u0628\u062f\u0623 \u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0645\u062c\u0627\u0646\u0627\u064b" },
  plans: { en: "View Plans", ar: "\u0634\u0648\u0641 \u0627\u0644\u062e\u0637\u0637" },
  generate: { en: "Generate", ar: "\u062a\u0648\u0644\u064a\u062f" },
  copy: { en: "Copy", ar: "\u0646\u0633\u062e" },
  send: { en: "Send", ar: "\u0623\u0631\u0633\u0644" },
  name: { en: "Name", ar: "\u0627\u0644\u0627\u0633\u0645" },
  email: { en: "Email", ar: "\u0627\u0644\u0628\u0631\u064a\u062f" },
  password: { en: "Password", ar: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631" },
  subject: { en: "Subject", ar: "\u0627\u0644\u0645\u0648\u0636\u0648\u0639" },
  message: { en: "Message", ar: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629" },
  topic: { en: "Enter topic...", ar: "\u0627\u0643\u062a\u0628 \u0627\u0644\u0645\u0648\u0636\u0648\u0639..." },
  paste: { en: "Paste content...", ar: "\u0627\u0644\u0635\u0642 \u0627\u0644\u0645\u062d\u062a\u0648\u0649..." },
  result: { en: "Result", ar: "\u0627\u0644\u0646\u062a\u064a\u062c\u0629" },
  copied: { en: "Copied!", ar: "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!" },
  nomoney: { en: "Not enough credits", ar: "\u0631\u0635\u064a\u062f\u0643 \u0645\u0634 \u0643\u0627\u0641\u064a" },
  loading: { en: "Generating...", ar: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0648\u0644\u064a\u062f..." },
  heroSub: { en: ". Now You Have One.", ar: ". \u062f\u0647 \u0639\u0642\u0644\u0643." },
  heroDesc: { en: "From first draft to published masterpiece \u2014 in minutes, not months. 29 languages. 31 eras. Your voice, amplified.", ar: "\u0645\u0646 \u0627\u0644\u0645\u0633\u0648\u062f\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0625\u0644\u0649 \u0627\u0644\u062a\u062d\u0641\u0629 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u2014 \u0641\u064a \u062f\u0642\u0627\u0626\u0642\u060c \u0645\u0634 \u0634\u0647\u0648\u0631. 28 \u0644\u063a\u0629. 31 \u062d\u0642\u0628\u0629. \u0635\u0648\u062a\u0643\u060c \u0628\u0623\u0636\u0639\u0627\u0641 \u0642\u0648\u062a\u0647." },
  comingSoon: { en: "Coming soon!", ar: "\u0642\u0631\u064a\u0628\u0627\u064b!" },
  noArticles: { en: "No articles yet", ar: "\u0644\u0633\u0647 \u0645\u0627 \u0643\u062a\u0628\u062a \u0645\u0642\u0627\u0644\u0627\u062a" },
  services: { en: "Services", ar: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" },
  billing: { en: "Billing", ar: "\u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631" },
  support: { en: "Support", ar: "\u0627\u0644\u062f\u0639\u0645" },
  myArticles: { en: "My Articles", ar: "\u0645\u0642\u0627\u0644\u0627\u062a\u064a" },
  myInfo: { en: "My Info", ar: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a\u064a" },
  levels: { en: "Levels", ar: "\u0627\u0644\u0645\u0633\u062a\u0648\u064a\u0627\u062a" },
  settings: { en: "Settings", ar: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" },
  language: { en: "Language", ar: "\u0627\u0644\u0644\u063a\u0629" },
  mood: { en: "Mood", ar: "\u0627\u0644\u0646\u0628\u0631\u0629" },
  timeMachine: { en: "Time Machine", ar: "\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646" },
  gender: { en: "Gender", ar: "\u0627\u0644\u062c\u0646\u0633" },
  neutral: { en: "Neutral", ar: "\u0645\u062d\u0627\u064a\u062f" },
  male: { en: "Male", ar: "\u0630\u0643\u0631" },
  female: { en: "Female", ar: "\u0623\u0646\u062b\u0649" },
  words: { en: "words", ar: "\u0643\u0644\u0645\u0629" },
  subscribe: { en: "Subscribe", ar: "\u0627\u0634\u062a\u0631\u0643" },
  startFree: { en: "Start Free", ar: "\u0627\u0628\u062f\u0623" },
  month: { en: "month", ar: "\u0634\u0647\u0631" },
  free: { en: "Free", ar: "\u0645\u062c\u0627\u0646\u064a" },
  popular: { en: "Popular", ar: "\u0627\u0644\u0623\u0643\u062b\u0631 \u0637\u0644\u0628\u0627\u064b" },
  bestValue: { en: "Best Value", ar: "\u0623\u0641\u0636\u0644 \u0642\u064a\u0645\u0629" },
  buyCredits: { en: "Buy Credits", ar: "\u0627\u0634\u062a\u0631\u064a" },
  balance: { en: "Balance", ar: "\u0631\u0635\u064a\u062f\u0643" },
  toolCosts: { en: "Tool Costs", ar: "\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0623\u062f\u0648\u0627\u062a" },
  creditPacks: { en: "Credit Packs", ar: "\u0628\u0627\u0642\u0627\u062a \u0627\u0644\u0643\u0631\u064a\u062f\u062a" },
  search: { en: "Search...", ar: "\u0627\u0628\u062d\u062b..." },
  sideA: { en: "Side A", ar: "\u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u0623\u0648\u0644" },
  sideB: { en: "Side B", ar: "\u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u062b\u0627\u0646\u064a" },
  roastTitle: { en: "The Article Roaster", ar: "\u0645\u062d\u0645\u0635\u0629 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" },
  roastSub: { en: "Drop your article and face the brutal truth", ar: "\u0627\u0631\u0645\u064a \u0645\u0642\u0627\u0644\u0643 \u0647\u0646\u0627 \u0648\u0634\u0648\u0641 \u0627\u0644\u062d\u0642\u064a\u0642\u0629 \u0627\u0644\u0645\u0631\u0629" },
  roastBtn: { en: "Roast My Article!", ar: "\u062d\u0645\u0651\u0635 \u0645\u0642\u0627\u0644\u064a!" },
  roastResults: { en: "Roast Results", ar: "\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u062a\u062d\u0645\u064a\u0635" },
  battleTitle: { en: "Battle Arena", ar: "\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0639\u0631\u0643\u0629" },
  battleBtn: { en: "Start Battle!", ar: "\u0627\u0628\u062f\u0623 \u0627\u0644\u0645\u0639\u0631\u0643\u0629!" },
  writersDir: { en: "Writers Directory", ar: "\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0651\u0627\u0628" },
  superWriter: { en: "AI Superwriter", ar: "\u0643\u0627\u062a\u0628 AI \u0627\u0644\u062e\u0627\u0631\u0642" },
  superTools: { en: "Superpowered Tools for Superpowered Writers", ar: "\u0623\u062f\u0648\u0627\u062a \u062e\u0627\u0631\u0642\u0629 \u0644\u0643\u062a\u0651\u0627\u0628 \u062e\u0627\u0631\u0642\u064a\u0646" },
  whatSay: { en: "What Our Writers Say", ar: "\u0645\u0627\u0630\u0627 \u064a\u0642\u0648\u0644 \u0643\u062a\u0651\u0627\u0628\u0646\u0627" },
  readyCTA: { en: "Ready to Write Content That Wows?", ar: "\u0645\u0633\u062a\u0639\u062f \u062a\u0643\u062a\u0628 \u0645\u062d\u062a\u0648\u0649 \u064a\u0628\u0647\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u061f" },
  freeCredits: { en: "10 free credits. No card needed.", ar: "10 \u0643\u0631\u064a\u062f\u062a\u0633 \u0645\u062c\u0627\u0646\u0627\u064b. \u0644\u0627 \u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062a\u0645\u0627\u0646." },
  getStarted: { en: "Get Started Now", ar: "\u0627\u0628\u062f\u0623 \u062f\u0644\u0648\u0642\u062a\u064a" },
  termsTitle: { en: "Terms of Service", ar: "\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645" },
  privacyTitle: { en: "Privacy Policy", ar: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629" },
  privacy: { en: "Privacy", ar: "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629" },
  notifications: { en: "Notifications", ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  noNotif: { en: "No notifications", ar: "\u0644\u0627 \u0625\u0634\u0639\u0627\u0631\u0627\u062a" },
  ban: { en: "Ban", ar: "\u062d\u0638\u0631" },
  unban: { en: "Unban", ar: "\u0641\u0643 \u062d\u0638\u0631" },
  freeze: { en: "Freeze", ar: "\u062a\u062c\u0645\u064a\u062f" },
  dashboard: { en: "Dashboard", ar: "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" },
  users: { en: "Users", ar: "\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646" },
  messages: { en: "Messages", ar: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644" },
  admins: { en: "Admins", ar: "\u0627\u0644\u0645\u0634\u0631\u0641\u064a\u0646" },
  gentle: { en: "Gentle Nudge", ar: "\u0646\u0642\u062f \u062e\u0641\u064a\u0641" },
  medium: { en: "Medium Roast", ar: "\u0646\u0642\u062f \u0645\u062a\u0648\u0633\u0637" },
  savage: { en: "Savage Mode", ar: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0648\u062d\u0634\u064a" },
  watermarkText: { en: "OxQuill.com \u2014 Upgrade to remove watermark", ar: "OxQuill.com \u2014 \u0627\u0634\u062a\u0631\u0643 \u0644\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0627\u0626\u064a\u0629" },
  cantCopy: { en: "Upgrade to copy content", ar: "\u0627\u0634\u062a\u0631\u0643 \u0644\u0646\u0633\u062e \u0627\u0644\u0645\u062d\u062a\u0648\u0649" },
  share: { en: "Share", ar: "\u0645\u0634\u0627\u0631\u0643\u0629" },
  messageSent: { en: "Message sent!", ar: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062a\u0643!" },
  fillFields: { en: "Fill all fields", ar: "\u0627\u0645\u0644\u0623 \u0643\u0644 \u0627\u0644\u062d\u0642\u0648\u0644" },
  enterTopic: { en: "Enter topic", ar: "\u0627\u0643\u062a\u0628 \u0627\u0644\u0645\u0648\u0636\u0648\u0639" },
  pasteContent: { en: "Paste content", ar: "\u0627\u0644\u0635\u0642 \u0627\u0644\u0645\u062d\u062a\u0648\u0649" },
  done: { en: "Done!", ar: "\u062a\u0645!" },
  checkEmail: { en: "Done! Check email", ar: "\u062a\u0645! \u0631\u0627\u062c\u0639 \u0628\u0631\u064a\u062f\u0643" },
  connError: { en: "Connection error", ar: "\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644" },
  roasting: { en: "Roasting...", ar: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0635..." },
  battleInProgress: { en: "Battle in progress...", ar: "\u0627\u0644\u0645\u0639\u0631\u0643\u0629 \u062c\u0627\u0631\u064a\u0629..." },
  googleLogin: { en: "Continue with Google", ar: "\u062f\u062e\u0648\u0644 \u0628\u062c\u0648\u062c\u0644" },
  or: { en: "or", ar: "\u0623\u0648" },
  shareTitle: { en: "Share Article", ar: "\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u0642\u0627\u0644" },
  shareLink: { en: "Copy Link", ar: "\u0646\u0633\u062e \u0627\u0644\u0631\u0627\u0628\u0637" },
  shareEmail: { en: "Email", ar: "\u0628\u0631\u064a\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
  shareSocial: { en: "Social Media", ar: "\u0633\u0648\u0634\u064a\u0627\u0644 \u0645\u064a\u062f\u064a\u0627" },
  sharePDF: { en: "Download PDF", ar: "\u062a\u062d\u0645\u064a\u0644 PDF" },
  shareInternal: { en: "Share in OxQuill", ar: "\u0645\u0634\u0627\u0631\u0643\u0629 \u062f\u0627\u062e\u0644 OxQuill" },
  linkCopied: { en: "Link copied!", ar: "\u062a\u0645 \u0646\u0633\u062e \u0627\u0644\u0631\u0627\u0628\u0637!" },
  allRights: { en: "All rights reserved.", ar: "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629." },
  acceptableUse: { en: "1. Acceptable Use", ar: "1. \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0642\u0628\u0648\u0644" },
  acceptableUseDesc: { en: "Generating illegal or harmful content is prohibited.", ar: "\u064a\u0645\u0646\u0639 \u062a\u0648\u0644\u064a\u062f \u0645\u062d\u062a\u0648\u0649 \u0645\u062e\u0627\u0644\u0641 \u0644\u0644\u0642\u0627\u0646\u0648\u0646." },
  contentOwnership: { en: "2. Content", ar: "2. \u0627\u0644\u0645\u062d\u062a\u0648\u0649" },
  contentOwnershipDesc: { en: "AI-generated content belongs to you. Review before publishing.", ar: "\u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0645\u0648\u0644\u062f \u064a\u062e\u0635\u0643. \u062a\u062a\u062d\u0645\u0644 \u0645\u0633\u0624\u0648\u0644\u064a\u0629 \u0645\u0631\u0627\u062c\u0639\u062a\u0647." },
  creditsPolicy: { en: "3. Credits", ar: "3. \u0627\u0644\u0643\u0631\u064a\u062f\u062a" },
  creditsPolicyDesc: { en: "Credits are non-refundable.", ar: "\u0627\u0644\u0643\u0631\u064a\u062f\u062a \u063a\u064a\u0631 \u0642\u0627\u0628\u0644 \u0644\u0644\u0627\u0633\u062a\u0631\u062f\u0627\u062f." },
  termsIntro: { en: "By using our platform, you agree to the following terms.", ar: "\u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645\u0643 \u0644\u0645\u0646\u0635\u062a\u0646\u0627\u060c \u062a\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u062a\u0627\u0644\u064a\u0629." },
  dataPolicy: { en: "1. Data", ar: "1. \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a" },
  dataPolicyDesc: { en: "We collect name and email only.", ar: "\u0646\u062c\u0645\u0639 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0628\u0631\u064a\u062f \u0641\u0642\u0637." },
  security: { en: "2. Security", ar: "2. \u0627\u0644\u0623\u0645\u0627\u0646" },
  securityDesc: { en: "We use SSL encryption.", ar: "\u0646\u0633\u062a\u062e\u062f\u0645 \u062a\u0634\u0641\u064a\u0631 SSL." },
  yourRights: { en: "3. Your Rights", ar: "3. \u062d\u0642\u0648\u0642\u0643" },
  yourRightsDesc: { en: "You can request account deletion anytime.", ar: "\u064a\u0645\u0643\u0646\u0643 \u0637\u0644\u0628 \u062d\u0630\u0641 \u062d\u0633\u0627\u0628\u0643 \u0641\u064a \u0623\u064a \u0648\u0642\u062a." },
};


/* ============ DATA ============ */
var TOOLS = [
  { id: "generate", icon: "\u270d\ufe0f", cost: 5, en: "Generate", ar: "\u062a\u0648\u0644\u064a\u062f" },
  { id: "roast", icon: "\ud83d\udd25", cost: 2, en: "Roast", ar: "\u062a\u062d\u0645\u064a\u0635" },
  { id: "viral", icon: "\ud83d\udcca", cost: 2, en: "Viral Score", ar: "\u0645\u062a\u0646\u0628\u0626 \u0627\u0646\u062a\u0634\u0627\u0631" },
  { id: "remix", icon: "\ud83d\udd04", cost: 3, en: "Remix", ar: "\u0631\u064a\u0645\u0643\u0633" },
  { id: "debate", icon: "\ud83d\udcac", cost: 6, en: "Debate", ar: "\u0645\u0646\u0627\u0638\u0631\u0629" },
  { id: "summary", icon: "\ud83d\udcdd", cost: 1, en: "Summary", ar: "\u0645\u0644\u062e\u0635" },
  { id: "titles", icon: "\ud83d\udca1", cost: 1, en: "Titles", ar: "\u0639\u0646\u0627\u0648\u064a\u0646" },
  { id: "thread", icon: "\ud83e\uddf5", cost: 2, en: "Thread", ar: "\u062b\u0631\u064a\u062f" },
  { id: "linkedin", icon: "\ud83d\udcbc", cost: 2, en: "LinkedIn", ar: "\u0644\u064a\u0646\u0643\u062f\u0625\u0646" },
  { id: "repurpose", icon: "\u267b\ufe0f", cost: 5, en: "Repurpose", ar: "\u0625\u0639\u0627\u062f\u0629 \u062a\u0648\u0638\u064a\u0641" },
];

var ALL_LANGUAGES = ["English","Arabic","Egyptian Arabic","Spanish","French","German","Italian","Portuguese","Russian","Chinese","Japanese","Korean","Hindi","Turkish","Dutch","Swedish","Polish","Czech","Greek","Hebrew","Thai","Vietnamese","Indonesian","Malay","Filipino","Swahili","Persian","Urdu","Bengali"];
var FREE_LANGUAGES = ["English","Arabic","Egyptian Arabic","Spanish","French","German"];

/* Language → flag emoji map */
var LANG_FLAGS = {
  "English": "\ud83c\uddfa\ud83c\uddf8", "Arabic": "\ud83c\uddf8\ud83c\udde6",
  "Egyptian Arabic": "\ud83c\uddea\ud83c\uddec",
  "Spanish": "\ud83c\uddea\ud83c\uddf8", "French": "\ud83c\uddeb\ud83c\uddf7",
  "German": "\ud83c\udde9\ud83c\uddea", "Italian": "\ud83c\uddee\ud83c\uddf9",
  "Portuguese": "\ud83c\uddf5\ud83c\uddf9", "Russian": "\ud83c\uddf7\ud83c\uddfa",
  "Chinese": "\ud83c\udde8\ud83c\uddf3", "Japanese": "\ud83c\uddef\ud83c\uddf5",
  "Korean": "\ud83c\uddf0\ud83c\uddf7", "Hindi": "\ud83c\uddee\ud83c\uddf3",
  "Turkish": "\ud83c\uddf9\ud83c\uddf7", "Dutch": "\ud83c\uddf3\ud83c\uddf1",
  "Swedish": "\ud83c\uddf8\ud83c\uddea", "Polish": "\ud83c\uddf5\ud83c\uddf1",
  "Czech": "\ud83c\udde8\ud83c\uddff", "Greek": "\ud83c\uddec\ud83c\uddf7",
  "Hebrew": "\ud83c\uddee\ud83c\uddf1", "Thai": "\ud83c\uddf9\ud83c\udded",
  "Vietnamese": "\ud83c\uddfb\ud83c\uddf3", "Indonesian": "\ud83c\uddee\ud83c\udde9",
  "Malay": "\ud83c\uddf2\ud83c\uddfe", "Filipino": "\ud83c\uddf5\ud83c\udded",
  "Swahili": "\ud83c\uddf0\ud83c\uddea", "Persian": "\ud83c\uddee\ud83c\uddf7",
  "Urdu": "\ud83c\uddf5\ud83c\uddf0", "Bengali": "\ud83c\udde7\ud83c\udde9",
};
function flag(l) { return LANG_FLAGS[l] ? (LANG_FLAGS[l] + " ") : ""; }
var MOOD_LIST = ["Professional","Casual","Academic","Creative","Humorous","Inspirational"];
/* V2.3 — Mood display translations (value stays English for AI API, label is localized) */
var MOOD_AR = {
  "Professional": "\u0631\u0633\u0645\u064a",
  "Casual": "\u0639\u0641\u0648\u064a",
  "Academic": "\u0623\u0643\u0627\u062f\u064a\u0645\u064a",
  "Creative": "\u0625\u0628\u062f\u0627\u0639\u064a",
  "Humorous": "\u0643\u0648\u0645\u064a\u062f\u064a",
  "Inspirational": "\u062a\u062d\u0641\u064a\u0632\u064a",
};
/* V3.0 — Mood emojis for visual dropdowns */
var MOOD_EMOJI = {
  "Professional": "\ud83d\udc54",  /* 👔 necktie */
  "Casual": "\u2615",                /* ☕ coffee */
  "Academic": "\ud83c\udf93",        /* 🎓 graduation cap */
  "Creative": "\ud83c\udfa8",        /* 🎨 artist palette */
  "Humorous": "\ud83d\ude02",        /* 😂 laugh */
  "Inspirational": "\u2728",         /* ✨ sparkles */
};
var ERA_LIST = ["1900","1905","1910","1915","1920","1925","1930","1935","1940","1945","1950","1955","1960","1965","1970","1975","1980","1985","1990","1995","2000","2005","2010","2015","2020","2022","2024","2025","2030","2040","2050"];

/* #10 Plan descriptions */
var PLANS = [
  { id: "free", name: "Free", price: 0, cr: 10,
    desc: { en: "Perfect for trying out OxQuill", ar: "\u0645\u062b\u0627\u0644\u064a \u0644\u062a\u062c\u0631\u0628\u0629 OxQuill" },
    features: { en: ["10 credits/mo","800 words max","6 languages","Watermark on content","No copy/share"], ar: ["10 \u0643\u0631\u064a\u062f\u062a/\u0634\u0647\u0631","800 \u0643\u0644\u0645\u0629 \u0645\u0627\u0643\u0633","6 \u0644\u063a\u0627\u062a","\u0639\u0644\u0627\u0645\u0629 \u0645\u0627\u0626\u064a\u0629","\u0628\u062f\u0648\u0646 \u0646\u0633\u062e/\u0645\u0634\u0627\u0631\u0643\u0629"] },
    watermark: true, canCopy: false, canShare: false },
  { id: "starter", name: "Starter", price: 19, cr: 100,
    desc: { en: "For regular content creators", ar: "\u0644\u0635\u0646\u0627\u0639 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0645\u0646\u062a\u0638\u0645\u064a\u0646" },
    features: { en: ["100 credits/mo","2000 words","29 languages","No watermark","Copy & Share enabled"], ar: ["100 \u0643\u0631\u064a\u062f\u062a/\u0634\u0647\u0631","2000 \u0643\u0644\u0645\u0629","29 \u0644\u063a\u0629","\u0628\u062f\u0648\u0646 \u0639\u0644\u0627\u0645\u0629 \u0645\u0627\u0626\u064a\u0629","\u0646\u0633\u062e \u0648\u0645\u0634\u0627\u0631\u0643\u0629"] },
    watermark: false, canCopy: true, canShare: true },
  { id: "pro", name: "Pro", price: 49, cr: 500, pop: true,
    desc: { en: "For professionals & teams", ar: "\u0644\u0644\u0645\u062d\u062a\u0631\u0641\u064a\u0646 \u0648\u0627\u0644\u0641\u0631\u0642" },
    features: { en: ["500 credits/mo","5000 words","All tools","Writers Directory","Priority support"], ar: ["500 \u0643\u0631\u064a\u062f\u062a/\u0634\u0647\u0631","5000 \u0643\u0644\u0645\u0629","\u0643\u0644 \u0627\u0644\u0623\u062f\u0648\u0627\u062a","\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0627\u0628","\u062f\u0639\u0645 \u0623\u0648\u0644\u0648\u064a\u0629"] },
    watermark: false, canCopy: true, canShare: true },
  { id: "agency", name: "Agency", price: 99, cr: 2000,
    desc: { en: "For agencies & enterprises", ar: "\u0644\u0644\u0648\u0643\u0627\u0644\u0627\u062a \u0648\u0627\u0644\u0634\u0631\u0643\u0627\u062a" },
    features: { en: ["2000 credits/mo","Unlimited words","API access","White label","Dedicated support"], ar: ["2000 \u0643\u0631\u064a\u062f\u062a/\u0634\u0647\u0631","\u0643\u0644\u0645\u0627\u062a \u063a\u064a\u0631 \u0645\u062d\u062f\u0648\u062f\u0629","API","\u0648\u0627\u064a\u062a \u0644\u064a\u0628\u0644","\u062f\u0639\u0645 \u0645\u062e\u0635\u0635"] },
    watermark: false, canCopy: true, canShare: true },
];

var PACKS = [
  { cr: 10, price: 5, label: "Starter", labelAr: "\u0645\u0628\u062a\u062f\u0626" },
  { cr: 50, price: 20, label: "Writer", labelAr: "\u0643\u0627\u062a\u0628" },
  { cr: 200, price: 60, label: "Pro", labelAr: "\u0645\u062d\u062a\u0631\u0641", best: true },
  { cr: 500, price: 120, label: "Agency", labelAr: "\u0648\u0643\u0627\u0644\u0629" },
];

var TESTIMONIALS = [
  { name: "Amira K.", nameAr: "\u0623\u0645\u064a\u0631\u0629 \u0643.", role: "Content Creator", roleAr: "\u0635\u0627\u0646\u0639\u0629 \u0645\u062d\u062a\u0648\u0649", text: "Oxquill cut my writing time by 70%. The Roast tool alone is worth it!", textAr: "Oxquill \u0642\u0644\u0644 \u0648\u0642\u062a \u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0628\u062a\u0627\u0639\u064a 70%. \u0623\u062f\u0627\u0629 \u0627\u0644\u0640 Roast \u0628\u0633 \u062a\u0633\u062a\u0627\u0647\u0644 \u0627\u0644\u0633\u0639\u0631!", stars: 5 },
  { name: "James W.", nameAr: "\u062c\u064a\u0645\u0633 \u0648.", role: "SaaS Founder", roleAr: "\u0645\u0624\u0633\u0633 SaaS", text: "Article Battle helped me pick winning headlines that doubled my CTR.", textAr: "\u0645\u0639\u0631\u0643\u0629 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a \u0633\u0627\u0639\u062f\u062a\u0646\u064a \u0623\u062e\u062a\u0627\u0631 \u0639\u0646\u0627\u0648\u064a\u0646 \u0636\u0627\u0639\u0641\u062a \u0627\u0644\u0640 CTR.", stars: 5 },
  { name: "Fatima S.", nameAr: "\u0641\u0627\u0637\u0645\u0629 \u0633.", role: "Marketing Manager", roleAr: "\u0645\u062f\u064a\u0631\u0629 \u062a\u0633\u0648\u064a\u0642", text: "29 languages and it nails Arabic grammar. Finally an AI that speaks my language.", textAr: "29 \u0644\u063a\u0629 \u0648\u0628\u064a\u062a\u0642\u0646 \u0627\u0644\u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0639\u0631\u0628\u064a\u0629. \u0623\u062e\u064a\u0631\u0627\u064b AI \u0628\u064a\u062a\u0643\u0644\u0645 \u0644\u063a\u062a\u064a.", stars: 5 },
];

var FEATURES = [
  { icon: "\u270d\ufe0f", en: "AI Writer", ar: "\u0643\u0627\u062a\u0628 AI", descEn: "10 AI tools, 29 languages, 6 moods", descAr: "10 \u0623\u062f\u0648\u0627\u062a AI\u060c 28 \u0644\u063a\u0629\u060c 6 \u0646\u0628\u0631\u0627\u062a", go: "writer" },
  { icon: "\ud83d\udd25", en: "Roast", ar: "\u0627\u0644\u0646\u0642\u062f", descEn: "Brutally honest AI feedback", descAr: "\u0646\u0642\u062f \u0630\u0643\u064a \u0635\u0631\u064a\u062d", go: "roast" },
  { icon: "\u2694\ufe0f", en: "Battle", ar: "\u0627\u0644\u0645\u0639\u0631\u0643\u0629", descEn: "AI debate between two sides", descAr: "\u0645\u0646\u0627\u0638\u0631\u0629 AI \u0628\u064a\u0646 \u0637\u0631\u0641\u064a\u0646", go: "battle" },
  { icon: "\ud83d\udcca", en: "Viral Score", ar: "\u0645\u062a\u0646\u0628\u0626 \u0627\u0644\u0627\u0646\u062a\u0634\u0627\u0631", descEn: "Predict content virality", descAr: "\u062a\u0648\u0642\u0639 \u0627\u0646\u062a\u0634\u0627\u0631 \u0627\u0644\u0645\u062d\u062a\u0648\u0649", go: "writer" },
  { icon: "\ud83d\udd04", en: "Remix", ar: "\u0631\u064a\u0645\u0643\u0633", descEn: "Restyle your content", descAr: "\u0623\u0639\u062f \u0635\u064a\u0627\u063a\u0629 \u0645\u062d\u062a\u0648\u0627\u0643", go: "writer" },
  { icon: "\u23f3", en: "Time Machine", ar: "\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646", descEn: "Write from any era", descAr: "\u0627\u0643\u062a\u0628 \u0645\u0646 \u0623\u064a \u062d\u0642\u0628\u0629", go: "writer" },
  { icon: "\ud83c\udf0d", en: "28 Languages", ar: "28 \u0644\u063a\u0629", descEn: "Write in any language", descAr: "\u0627\u0643\u062a\u0628 \u0628\u0623\u064a \u0644\u063a\u0629", go: "writer" },
  { icon: "\ud83d\udc65", en: "Writers Dir", ar: "\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0627\u0628", descEn: "Discover top writers", descAr: "\u0627\u0643\u062a\u0634\u0641 \u0623\u0641\u0636\u0644 \u0627\u0644\u0643\u062a\u0627\u0628", go: "writers" },
];

var LEVELS = [
  { lv: 1, n: "Beginner", nA: "\u0645\u0628\u062a\u062f\u0626", xp: 0, ic: "\ud83c\udf31", rw: { en: "10 free credits", ar: "10 \u0643\u0631\u064a\u062f\u064a\u062a \u0645\u062c\u0627\u0646\u064a" } },
  { lv: 2, n: "Writer", nA: "\u0643\u0627\u062a\u0628", xp: 100, ic: "\u270f\ufe0f", rw: { en: "Unlock Remix", ar: "\u0641\u062a\u062d Remix" } },
  { lv: 3, n: "Pro Writer", nA: "\u0645\u062d\u062a\u0631\u0641", xp: 300, ic: "\ud83d\udcdd", rw: { en: "Unlock Battle", ar: "\u0641\u062a\u062d Battle" } },
  { lv: 4, n: "Expert", nA: "\u062e\u0628\u064a\u0631", xp: 600, ic: "\u2b50", rw: { en: "+5 free credits", ar: "+5 \u0643\u0631\u064a\u062f\u064a\u062a" } },
  { lv: 5, n: "Master", nA: "\u0645\u0627\u0633\u062a\u0631", xp: 1000, ic: "\ud83c\udfc6", rw: { en: "Unlock Writers", ar: "\u0641\u062a\u062d Writers" } },
  { lv: 6, n: "Grand Master", nA: "\u062c\u0631\u0627\u0646\u062f \u0645\u0627\u0633\u062a\u0631", xp: 1500, ic: "\ud83d\udc51", rw: { en: "Gold Badge", ar: "\u0628\u0627\u062f\u062c \u0630\u0647\u0628\u064a" } },
  { lv: 7, n: "Legend", nA: "\u0623\u0633\u0637\u0648\u0631\u0629", xp: 2500, ic: "\ud83c\udf1f", rw: { en: "+10 credits", ar: "+10 \u0643\u0631\u064a\u062f\u064a\u062a" } },
  { lv: 8, n: "Visionary", nA: "\u0645\u0644\u0647\u0645", xp: 4000, ic: "\ud83d\udc8e", rw: { en: "Platinum Badge", ar: "\u0628\u0627\u062f\u062c \u0628\u0644\u0627\u062a\u064a\u0646\u064a\u0648\u0645" } },
  { lv: 9, n: "Genius", nA: "\u0639\u0628\u0642\u0631\u064a", xp: 6000, ic: "\ud83e\udde0", rw: { en: "+20 credits", ar: "+20 \u0643\u0631\u064a\u062f\u064a\u062a" } },
  { lv: 10, n: "Superbrain", nA: "\u062e\u0627\u0631\u0642", xp: 10000, ic: "\ud83e\uddb8", rw: { en: "VIP Membership", ar: "\u0639\u0636\u0648\u064a\u0629 VIP" } },
];

var CONTACT_TYPES = [
  { id: "suggestion", e: "\ud83d\udca1", en: "Suggestion", ar: "\u0627\u0642\u062a\u0631\u0627\u062d" },
  { id: "question", e: "\u2753", en: "Question", ar: "\u0633\u0624\u0627\u0644" },
  { id: "complaint", e: "\ud83d\ude24", en: "Complaint", ar: "\u0634\u0643\u0648\u0649" },
  { id: "collaboration", e: "\ud83e\udd1d", en: "Collaboration", ar: "\u062a\u0639\u0627\u0648\u0646" },
  { id: "business", e: "\ud83d\udcbc", en: "Business", ar: "\u062a\u062c\u0627\u0631\u064a" },
  { id: "technical", e: "\ud83d\udd27", en: "Technical", ar: "\u062a\u0642\u0646\u064a" },
];

/* #11 Writers for all + rank */
var DEMO_WRITERS = [
  { name: "Sarah Ahmed", nA: "\u0633\u0627\u0631\u0629 \u0623\u062d\u0645\u062f", spec: "Tech & AI", sA: "\u062a\u0642\u0646\u064a\u0629 \u0648\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a", arts: 124, rate: 4.9, rank: 1, bio: { en: "AI researcher & tech journalist with 5+ years experience", ar: "\u0628\u0627\u062d\u062b\u0629 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0635\u062d\u0641\u064a\u0629 \u062a\u0642\u0646\u064a\u0629 \u0628\u062e\u0628\u0631\u0629 5+ \u0633\u0646\u0648\u0627\u062a" } },
  { name: "Mohamed Ali", nA: "\u0645\u062d\u0645\u062f \u0639\u0644\u064a", spec: "Business", sA: "\u0623\u0639\u0645\u0627\u0644", arts: 89, rate: 4.7, rank: 3, bio: { en: "Business strategist & startup advisor", ar: "\u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a \u0623\u0639\u0645\u0627\u0644 \u0648\u0645\u0633\u062a\u0634\u0627\u0631 \u0634\u0631\u0643\u0627\u062a \u0646\u0627\u0634\u0626\u0629" } },
  { name: "Layla Hassan", nA: "\u0644\u064a\u0644\u0649 \u062d\u0633\u0646", spec: "Creative Writing", sA: "\u0643\u062a\u0627\u0628\u0629 \u0625\u0628\u062f\u0627\u0639\u064a\u0629", arts: 156, rate: 4.8, rank: 2, bio: { en: "Award-winning fiction & creative content writer", ar: "\u0643\u0627\u062a\u0628\u0629 \u0625\u0628\u062f\u0627\u0639\u064a\u0629 \u062d\u0627\u0626\u0632\u0629 \u0639\u0644\u0649 \u062c\u0648\u0627\u0626\u0632" } },
  { name: "Omar Nour", nA: "\u0639\u0645\u0631 \u0646\u0648\u0631", spec: "Marketing & SEO", sA: "\u062a\u0633\u0648\u064a\u0642 \u0648SEO", arts: 203, rate: 4.9, rank: 1, bio: { en: "Digital marketing expert, SEO specialist", ar: "\u062e\u0628\u064a\u0631 \u062a\u0633\u0648\u064a\u0642 \u0631\u0642\u0645\u064a \u0648\u0645\u062a\u062e\u0635\u0635 SEO" } },
];


/* ============ MAIN COMPONENT ============ */
export default function Home() {
  /* === STATE === */
  var [darkMode, setDarkMode] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [user, setUser] = useState(null);
  var [credits, setCredits] = useState(10);
  var [view, setView] = useState("landing");
  var [showMenu, setShowMenu] = useState(false);
  var [showAuth, setShowAuth] = useState(false);
  var [authMode, setAuthMode] = useState("login");
  var [showPw, setShowPw] = useState(false); /* #4 password eye */
  var [authEmail, setAuthEmail] = useState("");
  var [authPass, setAuthPass] = useState("");
  var [authName, setAuthName] = useState("");
  var [authLoading, setAuthLoading] = useState(false);
  var [toast, setToast] = useState(null);
  var [articles, setArticles] = useState(function () {
    /* Load from localStorage synchronously to avoid empty-then-filled flicker */
    try {
      if (typeof window !== "undefined") {
        var raw = window.localStorage.getItem("ox_articles");
        if (raw) { var parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed; }
      }
    } catch (e) {}
    return [];
  });

  /* Writer state */
  var [topic, setTopic] = useState("");
  var [language, setLanguage] = useState("English");
  var [mood, setMood] = useState("Professional");
  var [era, setEra] = useState("2024");
  var [wordCount, setWordCount] = useState(1000);
  var [gender, setGender] = useState("neutral");
  var [activeTool, setActiveTool] = useState("generate");
  var [pasteText, setPasteText] = useState("");
  var [generating, setGenerating] = useState(false);
  /* V2.3 — Persist result across page reloads (iOS Safari kills inactive tabs) */
  var [result, setResult] = useState(function () {
    try { return localStorage.getItem("ox_result") || ""; } catch (e) { return ""; }
  });

  /* V2.3 — Distinguishes initial session-restore from genuine user sign-in.
     Prevents iOS Safari page-restore from clearing the current view. */
  var authInitRef = useRef(false);

  /* Roast state */
  var [roastLevel, setRoastLevel] = useState("medium");

  /* Battle state */
  var [battleA, setBattleA] = useState("");
  var [battleB, setBattleB] = useState("");

  /* Profile state */
  var [profileTab, setProfileTab] = useState("info");

  /* Admin state */
  var [adminTab, setAdminTab] = useState("dashboard");
  var [apiBalance, setApiBalance] = useState(5);
  var [balanceInput, setBalanceInput] = useState("");
  /* V2.3 — Admin Messages */
  var [adminMessages, setAdminMessages] = useState([]);
  var [msgFilter, setMsgFilter] = useState("all");
  var [loadingMsgs, setLoadingMsgs] = useState(false);
  /* V2.4 — Admin Dashboard real stats */
  var [adminStats, setAdminStats] = useState({ users: 0, articles: 0, credits: 0 });
  var [loadingStats, setLoadingStats] = useState(false);
  /* V2.5 — Admin Users + Admins tabs */
  var [allUsers, setAllUsers] = useState([]);
  var [loadingUsers, setLoadingUsers] = useState(false);
  var [userSearch, setUserSearch] = useState("");
  var [allAdmins, setAllAdmins] = useState([]);
  var [loadingAdmins, setLoadingAdmins] = useState(false);
  var [addAdminEmail, setAddAdminEmail] = useState("");
  /* V2.6 — Credit grant input per user */
  var [creditInputs, setCreditInputs] = useState({});
  /* V2.8 — Inbox / Notifications */
  var [notifications, setNotifications] = useState([]);
  var [unreadCount, setUnreadCount] = useState(0);
  var [loadingNotifs, setLoadingNotifs] = useState(false);
  /* V2.5 — Ban appeal modal */
  var [banModalOpen, setBanModalOpen] = useState(false);
  var [banAppealText, setBanAppealText] = useState("");
  var [submittingAppeal, setSubmittingAppeal] = useState(false);

  /* Contact state */
  var [contactType, setContactType] = useState("suggestion");
  var [contactSubject, setContactSubject] = useState("");
  var [contactMsg, setContactMsg] = useState("");
  var [contactEmail, setContactEmail] = useState("");

  /* Other state */
  var [termsTab, setTermsTab] = useState("terms");
  var [writerSearch, setWriterSearch] = useState("");
  var [showNotifs, setShowNotifs] = useState(false);
  var [showShare, setShowShare] = useState(false); /* Share Modal */
  var [openArticle, setOpenArticle] = useState(null); /* FIX C: view saved article */
  var [showInvite, setShowInvite] = useState(false); /* V2.9 — Invite friends modal */

  /* === DERIVED === */
  var TH = darkMode ? DARK : LIGHT;
  var GRD = "linear-gradient(135deg, #5B6CF0, #9B7BF0)";
  var userPlan = (user && user.plan) || "free";
  var planData = PLANS.find(function (p) { return p.id === userPlan; }) || PLANS[0];
  var LANGUAGES = (userPlan === "free") ? FREE_LANGUAGES : ALL_LANGUAGES;
  var canCopy = planData.canCopy; /* #9 permissions */
  var canShare = planData.canShare;
  var hasWatermark = planData.watermark; /* #8 watermark */

  /* === HELPERS === */
  function t(key) {
    var entry = I18N[key];
    if (!entry) return key;
    if (typeof entry === "string") return entry;
    return rtl ? entry.ar : entry.en;
  }

  function showToast(msg, type) {
    setToast({ msg: msg, type: type || "info" });
    setTimeout(function () { setToast(null); }, 3000);
  }

  /* V2.3 — Unified gating helper.
     Returns true if allowed; otherwise shows upgrade toast and redirects.
     Optional cleanup runs before navigate (e.g. close an open modal). */
  function requirePaid(allowed, failMsg, cleanup) {
    if (allowed) return true;
    showToast(failMsg, "error");
    setTimeout(function () {
      if (cleanup) cleanup();
      navigate("pricing");
    }, 900);
    return false;
  }

  /* V2.8 — Notification helper. Admin/system creates notification for a user. */
  async function createNotification(userId, type, title, message) {
    if (!safeSupa || !userId) return;
    try {
      var res = await safeSupa
        .from("notifications")
        .insert([{
          user_id: userId,
          type: type,
          title: title,
          message: message || "",
          is_read: false,
        }]);
      if (res.error) console.error("createNotification error:", res.error);
    } catch (e) { console.error("createNotification failed:", e); }
  }

  /* V2.3 — Admin Message handlers */
  async function markMessageRead(msgId) {
    if (!safeSupa) return;
    try {
      await safeSupa.from("contact_messages").update({ status: "read" }).eq("id", msgId);
      setAdminMessages(function (prev) {
        return prev.map(function (m) {
          return m.id === msgId ? Object.assign({}, m, { status: "read" }) : m;
        });
      });
    } catch (e) { console.error("markMessageRead failed:", e); }
  }

  async function markMessageReplied(msgId) {
    if (!safeSupa) return;
    try {
      await safeSupa.from("contact_messages").update({ status: "replied" }).eq("id", msgId);
      setAdminMessages(function (prev) {
        return prev.map(function (m) {
          return m.id === msgId ? Object.assign({}, m, { status: "replied" }) : m;
        });
      });
    } catch (e) { console.error("markMessageReplied failed:", e); }
  }

  function replyToMessage(msg) {
    var subj = encodeURIComponent("Re: " + (msg.subject || ""));
    var body = encodeURIComponent("\n\n---\n" + (msg.message || ""));
    window.open("mailto:" + msg.email + "?subject=" + subj + "&body=" + body);
    markMessageReplied(msg.id);
  }

  /* #12 Browser back button */
  function navigate(v) {
    setView(v);
    setShowMenu(false);
    setResult("");
    window.scrollTo(0, 0);
    try { window.history.pushState({ view: v }, "", "/?v=" + v); } catch (e) {}
  }

  /* #5 Button animation helpers */
  function onHoverIn(e) {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow = "0 6px 24px rgba(91,108,240,0.15)";
  }
  function onHoverOut(e) {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }
  function onPress(e) {
    e.currentTarget.style.transform = "scale(0.97)";
  }
  function onCardHoverIn(e) {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 8px 28px rgba(91,108,240,0.1)";
    e.currentTarget.style.borderColor = "#5B6CF0";
  }
  function onCardHoverOut(e) {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.borderColor = TH.border;
  }

  /* === EFFECTS === */

  /* #12 popstate listener */
  useEffect(function () {
    function handlePop(e) {
      if (e.state && e.state.view) {
        setView(e.state.view);
        setShowMenu(false);
        window.scrollTo(0, 0);
      } else {
        var params = new URLSearchParams(window.location.search);
        var v = params.get("v");
        setView(v || "landing");
      }
    }
    window.addEventListener("popstate", handlePop);
    /* Check URL on load */
    var params = new URLSearchParams(window.location.search);
    var initView = params.get("v");
    if (initView) setView(initView);
    return function () { window.removeEventListener("popstate", handlePop); };
  }, []);

  /* Load preferences */
  useEffect(function () {
    try {
      if (localStorage.getItem("ox_dark") === "1") setDarkMode(true);
      if (localStorage.getItem("ox_rtl") === "1") setRtl(true);
    } catch (e) {}
    /* Supabase auth */
    if (safeSupa) {
      /* V2.3 — Ref to distinguish initial session load from genuine sign-in.
         Without this, iOS Safari page-restore triggers navigate("writer")
         which clears the current view and result. */
      try {
        safeSupa.auth.getSession().then(function (res) {
          if (res.data.session) loadUser(res.data.session.user);
          /* Mark init complete AFTER session loaded so next SIGNED_IN is genuine */
          authInitRef.current = true;
        });
        safeSupa.auth.onAuthStateChange(function (event, session) {
          if (event === "SIGNED_IN" && session) {
            loadUser(session.user);
            setShowAuth(false);
            /* Only navigate on a real user-initiated sign-in, not page restoration */
            if (authInitRef.current) {
              navigate("writer");
            }
          }
          if (event === "SIGNED_OUT") {
            setUser(null);
            setCredits(10);
            navigate("landing");
          }
        });
      } catch (e) {}
    }
  }, []);

  /* #14 Disable right-click + text selection for free users */
  useEffect(function () {
    if (!canCopy) {
      function blockContext(e) {
        if (e.target.closest("[data-result]")) e.preventDefault();
      }
      document.addEventListener("contextmenu", blockContext);
      return function () { document.removeEventListener("contextmenu", blockContext); };
    }
  }, [canCopy]);
  /* Save preferences */
  useEffect(function () {
    try { localStorage.setItem("ox_dark", darkMode ? "1" : "0"); } catch (e) {}
  }, [darkMode]);
  useEffect(function () {
    try { localStorage.setItem("ox_rtl", rtl ? "1" : "0"); } catch (e) {}
  }, [rtl]);
  /* Persist articles to localStorage on every change */
  useEffect(function () {
    try { localStorage.setItem("ox_articles", JSON.stringify(articles)); } catch (e) {}
  }, [articles]);

  /* V2.3 — Persist result (survives iOS Safari background-kill) */
  useEffect(function () {
    try {
      if (result) {
        localStorage.setItem("ox_result", result);
      } else {
        localStorage.removeItem("ox_result");
      }
    } catch (e) {}
  }, [result]);

  /* V2.3 — Fetch admin messages when Messages tab is opened */
  useEffect(function () {
    if (view !== "admin" || adminTab !== "messages" || !safeSupa || !user) return;
    var isAdmin = user.isAdmin || user.email === "aanour1985@gmail.com";
    if (!isAdmin) return;
    setLoadingMsgs(true);
    (async function () {
      try {
        var msgRes = await safeSupa
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (!msgRes.data) { setLoadingMsgs(false); return; }
        var msgs = msgRes.data;
        /* V2.7.2 — Manually fetch emails since contact_messages has user_id not email */
        var userIds = msgs.map(function (m) { return m.user_id; }).filter(Boolean);
        var uniqueIds = Array.from(new Set(userIds));
        var emailMap = {};
        if (uniqueIds.length > 0) {
          var profRes = await safeSupa
            .from("profiles")
            .select("id, email, name")
            .in("id", uniqueIds);
          if (profRes.data) {
            profRes.data.forEach(function (p) {
              emailMap[p.id] = { email: p.email || "", name: p.name || "" };
            });
          }
        }
        var flat = msgs.map(function (m) {
          var p = emailMap[m.user_id] || {};
          return Object.assign({}, m, { email: p.email || "", _name: p.name || "" });
        });
        setAdminMessages(flat);
      } catch (e) {
        console.error("fetchMessages failed:", e);
      } finally {
        setLoadingMsgs(false);
      }
    })();
  }, [view, adminTab, user]);

  /* V2.8 — Fetch user's notifications whenever user is logged in or refreshes.
     Also auto-deletes notifications older than 30 days on each fetch. */
  useEffect(function () {
    if (!safeSupa || !user) return;
    setLoadingNotifs(true);
    (async function () {
      try {
        /* Auto-cleanup: delete notifications older than 30 days */
        var cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        try {
          await safeSupa
            .from("notifications")
            .delete()
            .eq("user_id", user.id)
            .lt("created_at", cutoff);
        } catch (e) { /* non-critical */ }

        var res = await safeSupa
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);
        if (res.data) {
          setNotifications(res.data);
          var unread = res.data.filter(function (n) { return !n.is_read; }).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        console.error("fetchNotifications failed:", e);
      } finally {
        setLoadingNotifs(false);
      }
    })();
  }, [user]);

  /* V2.8 — Admin: count of unread messages (for tab badge) */
  var unreadMessagesCount = adminMessages.filter(function (m) {
    return (m.status || "new") === "new";
  }).length;

  async function markNotificationRead(notifId) {
    if (!safeSupa) return;
    try {
      await safeSupa
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notifId);
      setNotifications(function (prev) {
        return prev.map(function (n) {
          return n.id === notifId ? Object.assign({}, n, { is_read: true }) : n;
        });
      });
      setUnreadCount(function (c) { return Math.max(0, c - 1); });
    } catch (e) { console.error("markNotificationRead failed:", e); }
  }

  async function markAllNotificationsRead() {
    if (!safeSupa || !user) return;
    try {
      await safeSupa
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      setNotifications(function (prev) {
        return prev.map(function (n) { return Object.assign({}, n, { is_read: true }); });
      });
      setUnreadCount(0);
      showToast(rtl ? "\u062a\u0645 \u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621" : "All marked as read", "success");
    } catch (e) { console.error("markAllNotificationsRead failed:", e); }
  }

  /* V2.9 — Invite friends: prepared message + share/copy handlers */
  function getInviteMessage() {
    if (rtl) {
      return "\u064a\u0627 \u0635\u0627\u062d\u0628\u064a\u0021 \ud83d\udd25\n"
        + "\u0644\u0642\u064a\u062a \u0645\u0648\u0642\u0639 \u062e\u0631\u0627\u0641\u064a \u0627\u0633\u0645\u0647 OxQuill \u0628\u064a\u0643\u062a\u0628\u0644\u0643 \u0623\u064a \u0645\u0642\u0627\u0644 \u0641\u064a \u062b\u0648\u0627\u0646\u064a \u0628\u0640 AI\u060c \u0648 \u0628\u064a\u062f\u0639\u0645 29 \u0644\u063a\u0629 \u0648 31 \u062d\u0642\u0628\u0629 \u062a\u0627\u0631\u064a\u062e\u064a\u0629\u0021\n\n"
        + "\u062c\u0631\u0628\u062a\u0647 \u0648 \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0639\u0633\u0644 \ud83c\udf6f\n"
        + "\u0625\u0646\u062a \u0643\u0645\u0627\u0646 \u062c\u0631\u0628\u0647 \u0648 \u0642\u0648\u0644\u064a \u0631\u0623\u064a\u0643\u003a\n"
        + "\ud83d\udc49 https://oxquill.com\n\n"
        + "Superbrain for Writers \u270d\ufe0f";
    }
    return "Hey! \ud83d\ude80\n"
      + "Just found this crazy AI writing tool \u2014 OxQuill.\n"
      + "It writes articles in seconds across 29 languages & 31 historical eras.\n\n"
      + "Try it, you\u2019ll love it:\n"
      + "\ud83d\udc49 https://oxquill.com\n\n"
      + "Every Writer Deserves a Superbrain \u2728";
  }

  async function handleInviteShare() {
    var msg = getInviteMessage();
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        /* text already contains the URL — don't pass `url` to avoid duplication in WhatsApp/Messages */
        await navigator.share({
          title: "OxQuill",
          text: msg,
        });
        /* Successful share — modal stays open so user can share again if they want */
      } else {
        /* Fallback to copy when Web Share API unavailable (desktop browsers) */
        await handleInviteCopy();
      }
    } catch (e) {
      /* User cancelled share sheet — no toast needed. Only log other errors. */
      if (e && e.name !== "AbortError") {
        console.error("Invite share failed:", e);
        showToast(rtl ? "\u0641\u0634\u0644 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629" : "Share failed", "error");
      }
    }
  }

  async function handleInviteCopy() {
    var msg = getInviteMessage();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg);
        showToast(rtl ? "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e \u0625\u0644\u0649 \u0627\u0644\u062d\u0627\u0641\u0638\u0629 \ud83d\udccb" : "Copied to clipboard \ud83d\udccb", "success");
      } else {
        /* Very old browser fallback */
        showToast(rtl ? "\u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0644\u0627 \u064a\u062f\u0639\u0645 \u0627\u0644\u0646\u0633\u062e" : "Browser does not support copy", "error");
      }
    } catch (e) {
      console.error("Invite copy failed:", e);
      showToast(rtl ? "\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062e" : "Copy failed", "error");
    }
  }

  /* V2.4 — Fetch admin dashboard stats when Dashboard tab is opened */
  useEffect(function () {
    if (view !== "admin" || adminTab !== "dashboard" || !safeSupa || !user) return;
    var isAdmin = user.isAdmin || user.email === "aanour1985@gmail.com";
    if (!isAdmin) return;

    async function fetchStats() {
      try {
        var usersRes = await safeSupa
          .from("profiles")
          .select("*", { count: "exact", head: true });
        var articlesRes = await safeSupa
          .from("articles")
          .select("*", { count: "exact", head: true });
        var creditsRes = await safeSupa
          .from("profiles")
          .select("credits, is_admin");
        var totalCredits = 0;
        if (creditsRes.data) {
          creditsRes.data.forEach(function (p) {
            if (p.is_admin) return;
            if (typeof p.credits === "number") totalCredits += p.credits;
          });
        }
        setAdminStats({
          users: usersRes.count || 0,
          articles: articlesRes.count || 0,
          credits: totalCredits,
        });
      } catch (e) {
        console.error("fetchAdminStats failed:", e);
      } finally {
        setLoadingStats(false);
      }
    }

    /* V2.5 — Initial fetch + auto-refresh every 60s while on Dashboard */
    setLoadingStats(true);
    fetchStats();
    var interval = setInterval(fetchStats, 60000);
    return function () { clearInterval(interval); };
  }, [view, adminTab, user]);

  /* V2.5 — Fetch all users when Users tab is opened */
  useEffect(function () {
    if (view !== "admin" || adminTab !== "users" || !safeSupa || !user) return;
    var isAdmin = user.isAdmin || user.email === "aanour1985@gmail.com";
    if (!isAdmin) return;
    setLoadingUsers(true);
    safeSupa
      .from("profiles")
      .select("*")
      .then(function (res) {
        if (res.error) {
          console.error("fetchAllUsers error:", res.error);
          showToast(
            (rtl ? "\u26a0\ufe0f \u0641\u0634\u0644 \u062c\u0644\u0628 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646: " : "\u26a0\ufe0f Users fetch failed: ") + (res.error.message || ""),
            "error"
          );
        } else if (res.data) {
          /* Sort by created_at descending if present, else by id */
          var sorted = res.data.slice().sort(function (a, b) {
            var aDate = a.created_at || "";
            var bDate = b.created_at || "";
            if (aDate && bDate) return bDate.localeCompare(aDate);
            return 0;
          });
          setAllUsers(sorted);
        }
        setLoadingUsers(false);
      })
      .catch(function (e) {
        console.error("fetchAllUsers failed:", e);
        showToast(
          (rtl ? "\u26a0\ufe0f \u062e\u0637\u0623: " : "\u26a0\ufe0f Error: ") + (e.message || ""),
          "error"
        );
        setLoadingUsers(false);
      });
  }, [view, adminTab, user]);

  /* V2.5 — Fetch all admins when Admins tab is opened */
  useEffect(function () {
    if (view !== "admin" || adminTab !== "admins" || !safeSupa || !user) return;
    var isAdmin = user.isAdmin || user.email === "aanour1985@gmail.com";
    if (!isAdmin) return;
    setLoadingAdmins(true);
    safeSupa
      .from("profiles")
      .select("id, email, name, created_at")
      .eq("is_admin", true)
      .order("created_at", { ascending: true })
      .then(function (res) {
        if (res.data) setAllAdmins(res.data);
        setLoadingAdmins(false);
      })
      .catch(function (e) {
        console.error("fetchAllAdmins failed:", e);
        setLoadingAdmins(false);
      });
  }, [view, adminTab, user]);

  /* === AUTH FUNCTIONS === */
  async function loadUser(authUser) {
    if (!safeDb) return;
    try {
      var profile = await safeDb.getProfile(authUser.id);
      /* V2.7.1 — Supplement profile with direct query to guarantee all fields are loaded.
         db.js getProfile may not SELECT is_banned/is_frozen since they were added later. */
      if (safeSupa) {
        try {
          var suppl = await safeSupa
            .from("profiles")
            .select("is_banned, is_frozen, credits, plan, is_admin, name, xp")
            .eq("id", authUser.id)
            .maybeSingle();
          if (suppl.data) {
            profile = profile ? Object.assign({}, profile, suppl.data) : suppl.data;
          }
        } catch (e) { console.error("supplement profile failed:", e); }
      }
      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profile.name || "",
          plan: profile.plan || "free",
          isAdmin: profile.is_admin || false,
          xp: profile.xp || 0,
          isBanned: profile.is_banned || false,
          isFrozen: profile.is_frozen || false,
        });
        setCredits(profile.credits || 10);
        /* V2.5 — If user is banned, open appeal modal */
        if (profile.is_banned) setBanModalOpen(true);
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: (authUser.user_metadata && authUser.user_metadata.name) || "",
          plan: "free",
          isAdmin: authUser.email === "aanour1985@gmail.com",
          xp: 0,
          isBanned: false,
          isFrozen: false,
        });
      }
      /* FIX 4: Load articles from DB and MERGE with localStorage (don't replace) */
      try {
        var loadFn = safeDb.getUserArticles || safeDb.getArticles || safeDb.loadArticles;
        if (loadFn) {
          var list = await loadFn(authUser.id);
          if (Array.isArray(list) && list.length) {
            setArticles(function (prev) {
              /* Merge by unique topic+created_at, keeping most recent first */
              var combined = list.concat(prev);
              var seen = {};
              var unique = combined.filter(function (a) {
                var key = (a.id || a.topic + "_" + (a.created_at || a.createdAt || ""));
                if (seen[key]) return false;
                seen[key] = true;
                return true;
              });
              return unique;
            });
          }
        }
      } catch (e) { console.error("loadArticles failed:", e); }
    } catch (e) {}
  }

  async function handleLogin() {
    if (!safeDb || !authEmail || !authPass) {
      showToast(t("nomoney"), "error");
      return;
    }
    setAuthLoading(true);
    try {
      var res = await safeDb.signIn(authEmail, authPass);
      if (res && res.error) showToast(res.error.message, "error");
    } catch (e) {
      showToast(e.message, "error");
    }
    setAuthLoading(false);
  }

  async function handleSignup() {
    if (!safeDb || !authEmail || !authPass || !authName) {
      showToast(t("fillFields"), "error");
      return;
    }
    setAuthLoading(true);
    try {
      var res = await safeDb.signUp(authEmail, authPass, authName, "neutral");
      if (res && res.error) showToast(res.error.message, "error");
      else showToast(t("checkEmail"), "success");
    } catch (e) {
      showToast(e.message, "error");
    }
    setAuthLoading(false);
  }

  async function handleLogout() {
    if (safeDb) {
      try { await safeDb.signOut(); } catch (e) {}
    }
    setUser(null);
    setCredits(10);
    navigate("landing");
  }

  async function handleGoogleLogin() {
    if (!safeSupa) {
      showToast(rtl ? "\u0645\u0634\u0643\u0644\u0629 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644" : "Connection error", "error");
      return;
    }
    try {
      await safeSupa.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
    } catch (e) {
      showToast(e.message, "error");
    }
  }

  /* === GENERATION === */
  var PASTE_TOOLS = ["roast", "viral", "remix", "summary", "titles", "thread", "linkedin", "repurpose"];

  function buildPrompt(toolParam) {
    var currentTool = toolParam || activeTool;
    var genderNote = gender === "male"
      ? " Write with masculine voice."
      : gender === "female"
        ? " Write with feminine voice."
        : "";

    if (currentTool === "generate") {
      return "Write a " + wordCount + "-word article about: " + topic +
        ". Language: " + language + ". Tone: " + mood +
        ". Write as if in the year " + era + "." + genderNote;
    }
    if (currentTool === "roast") {
      var lvNote = roastLevel === "gentle"
        ? "Be constructive and encouraging with light humor."
        : roastLevel === "savage"
          ? "Be absolutely BRUTAL and merciless (but still constructive underneath the savagery)."
          : "Balance humor with genuine constructive feedback.";
      /* V2.3 — unified language state */
      return "You are a brutally honest but hilarious writing critic. " + lvNote +
        " Respond in " + language + ". Roast this article. Give it a score out of 10." +
        " Point out weaknesses, cliches, and cringe." +
        " End with 3 actual tips to improve it.\n\nArticle:\n" + pasteText;
    }
    if (currentTool === "viral") {
      return "Analyze the viral potential of this content. Give a score from 1-100 with detailed feedback. Respond in " + language + ".\n\n" + pasteText;
    }
    if (currentTool === "remix") {
      return "Remix this content into " + mood + " style. Language: " + language + ".\n\n" + pasteText;
    }
    if (currentTool === "debate") {
      var debateTopic = (battleA.trim() && battleB.trim()) ? (battleA + " vs " + battleB) : topic;
      /* V2.3 — unified language state */
      return "Create a detailed debate about: " + debateTopic + ". Language: " + language +
        ". Present BOTH sides with evidence, arguments, and counterarguments. Declare a winner with reasoning.";
    }
    if (currentTool === "summary") {
      return "Summarize this in 3 bullet points + a TL;DR. Language: " + language + ".\n\n" + pasteText;
    }
    if (currentTool === "titles") {
      return "Generate 10 click-worthy, SEO-optimized titles for this content. Language: " + language + ".\n\n" + (pasteText || topic);
    }
    if (currentTool === "thread") {
      return "Convert this into a Twitter/X thread of 8-12 tweets. Make each tweet engaging. Language: " + language + ".\n\n" + pasteText;
    }
    if (currentTool === "linkedin") {
      return "Convert this into a professional LinkedIn post with hooks and hashtags. Language: " + language + ".\n\n" + pasteText;
    }
    if (currentTool === "repurpose") {
      return "Repurpose this content into 5 formats: blog post, social media post, email newsletter, video script, and podcast outline. Language: " + language + ".\n\n" + pasteText;
    }
    return "Write about: " + topic;
  }

  /* V2.3 — Unified save helper.
     Called for EVERY tool after successful generation.
     Saves to local state first (guaranteed), then DB (best-effort). */
  /* V2.5 — Admin actions: ban/freeze/admin toggle, appeal submit */
  async function refreshAllUsers() {
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .select("id, email, name, plan, credits, is_admin, is_banned, is_frozen, created_at")
        .order("created_at", { ascending: false });
      if (res.data) setAllUsers(res.data);
    } catch (e) { console.error("refreshAllUsers failed:", e); }
  }

  async function refreshAllAdmins() {
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .select("id, email, name, created_at")
        .eq("is_admin", true)
        .order("created_at", { ascending: true });
      if (res.data) setAllAdmins(res.data);
    } catch (e) { console.error("refreshAllAdmins failed:", e); }
  }

  /* V2.8 — Notification helpers */
  function bi(ar, en) {
    /* Store bilingual text as JSON so notifications work in both languages */
    return JSON.stringify({ ar: ar, en: en });
  }

  function parseNotif(text) {
    if (!text) return { ar: "", en: "" };
    try {
      var obj = JSON.parse(text);
      if (obj && typeof obj === "object" && (obj.ar || obj.en)) return obj;
    } catch (e) {}
    return { ar: text, en: text };
  }

  async function createNotification(userId, type, titleBi, messageBi) {
    if (!safeSupa || !userId) return;
    try {
      await safeSupa.from("notifications").insert([{
        user_id: userId,
        type: type,
        title: titleBi,
        message: messageBi || "",
        is_read: false,
      }]);
    } catch (e) { console.error("createNotification failed:", e); }
  }

  async function handleToggleBan(userId, currentStatus, userEmail) {
    if (userEmail === "aanour1985@gmail.com") {
      showToast(rtl ? "\u0645\u0627\u064a\u0646\u0641\u0639\u0634 \u062a\u062d\u0638\u0631 \u0627\u0644\u0645\u0627\u0644\u0643" : "Cannot ban the owner", "error");
      return;
    }
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .update({ is_banned: !currentStatus })
        .eq("id", userId);
      if (res.error) throw res.error;
      showToast(
        !currentStatus
          ? (rtl ? "\u062a\u0645 \u062d\u0638\u0631 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645" : "User banned")
          : (rtl ? "\u062a\u0645 \u0631\u0641\u0639 \u0627\u0644\u062d\u0638\u0631" : "User unbanned"),
        "success"
      );
      /* V2.8 — notify the user */
      if (!currentStatus) {
        createNotification(userId, "banned",
          rtl ? "\ud83d\udeab \u062a\u0645 \u062d\u0638\u0631 \u062d\u0633\u0627\u0628\u0643" : "\ud83d\udeab Your account has been suspended",
          rtl ? "\u062a\u0645 \u062d\u0638\u0631 \u062d\u0633\u0627\u0628\u0643 \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0623\u062f\u0645\u0646. \u064a\u0645\u0643\u0646\u0643 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0644\u0631\u0641\u0639 \u0627\u0644\u062d\u0638\u0631." : "Your account was suspended by admin. You may submit an appeal.");
      } else {
        createNotification(userId, "unbanned",
          rtl ? "\u2705 \u062a\u0645 \u0631\u0641\u0639 \u0627\u0644\u062d\u0638\u0631 \u0639\u0646 \u062d\u0633\u0627\u0628\u0643" : "\u2705 Your account has been unsuspended",
          rtl ? "\u0645\u0631\u062d\u0628\u0627\u064b \u0628\u0639\u0648\u062f\u062a\u0643! \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0622\u0646 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0646\u0635\u0629 \u0628\u0634\u0643\u0644 \u0637\u0628\u064a\u0639\u064a." : "Welcome back! You can now use the platform normally.");
      }
      refreshAllUsers();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  async function handleToggleFreeze(userId, currentStatus, userEmail) {
    if (userEmail === "aanour1985@gmail.com") {
      showToast(rtl ? "\u0645\u0627\u064a\u0646\u0641\u0639\u0634 \u062a\u062c\u0645\u062f \u0627\u0644\u0645\u0627\u0644\u0643" : "Cannot freeze the owner", "error");
      return;
    }
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .update({ is_frozen: !currentStatus })
        .eq("id", userId);
      if (res.error) throw res.error;
      showToast(
        !currentStatus
          ? (rtl ? "\u062a\u0645 \u062a\u062c\u0645\u064a\u062f \u0627\u0644\u062d\u0633\u0627\u0628" : "Account frozen")
          : (rtl ? "\u062a\u0645 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u062a\u062c\u0645\u064a\u062f" : "Account unfrozen"),
        "success"
      );
      /* V2.8 — notify user */
      if (!currentStatus) {
        createNotification(userId, "frozen",
          rtl ? "\u2744\ufe0f \u062a\u0645 \u062a\u062c\u0645\u064a\u062f \u062d\u0633\u0627\u0628\u0643" : "\u2744\ufe0f Your account has been frozen",
          rtl ? "\u062a\u0645 \u062a\u062c\u0645\u064a\u062f \u062d\u0633\u0627\u0628\u0643 \u0645\u0624\u0642\u062a\u0627\u064b. \u0644\u0627 \u064a\u0645\u0643\u0646\u0643 \u062a\u0648\u0644\u064a\u062f \u0645\u0642\u0627\u0644\u0627\u062a \u062c\u062f\u064a\u062f\u0629. \u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062f\u0639\u0645." : "Your account is temporarily frozen. You cannot generate new articles. Contact support.");
      } else {
        createNotification(userId, "unfrozen",
          rtl ? "\ud83d\udd13 \u062a\u0645 \u0625\u0644\u063a\u0627\u0621 \u062a\u062c\u0645\u064a\u062f \u062d\u0633\u0627\u0628\u0643" : "\ud83d\udd13 Your account has been unfrozen",
          rtl ? "\u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0622\u0646 \u062a\u0648\u0644\u064a\u062f \u0645\u0642\u0627\u0644\u0627\u062a \u062c\u062f\u064a\u062f\u0629." : "You can now generate new articles.");
      }
      refreshAllUsers();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  async function handleAddAdmin() {
    var email = (addAdminEmail || "").trim().toLowerCase();
    if (!email) {
      showToast(rtl ? "\u0623\u062f\u062e\u0644 \u0625\u064a\u0645\u064a\u0644" : "Enter an email", "error");
      return;
    }
    if (!safeSupa) return;
    try {
      /* Find user by email first */
      var findRes = await safeSupa
        .from("profiles")
        .select("id, is_admin")
        .eq("email", email)
        .maybeSingle();
      if (findRes.error) throw findRes.error;
      if (!findRes.data) {
        showToast(rtl ? "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645" : "User not found", "error");
        return;
      }
      if (findRes.data.is_admin) {
        showToast(rtl ? "\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0623\u062f\u0645\u0646 \u0628\u0627\u0644\u0641\u0639\u0644" : "Already an admin", "info");
        return;
      }
      var updateRes = await safeSupa
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", findRes.data.id);
      if (updateRes.error) throw updateRes.error;
      showToast(rtl ? "\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u062f\u0645\u0646" : "Admin added", "success");
      setAddAdminEmail("");
      refreshAllAdmins();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  async function handleRemoveAdmin(userId, userEmail) {
    if (userEmail === "aanour1985@gmail.com") {
      showToast(rtl ? "\u0645\u0627\u064a\u0646\u0641\u0639\u0634 \u062a\u0634\u064a\u0644 \u0627\u0644\u0645\u0627\u0644\u0643" : "Cannot remove owner", "error");
      return;
    }
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .update({ is_admin: false })
        .eq("id", userId);
      if (res.error) throw res.error;
      showToast(rtl ? "\u062a\u0645 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0623\u062f\u0645\u0646" : "Admin removed", "success");
      refreshAllAdmins();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  /* V2.6 — Grant/deduct credits for a user */
  async function handleGrantCredits(userId, currentCredits) {
    var raw = creditInputs[userId];
    var delta = parseInt(raw, 10);
    if (isNaN(delta) || delta === 0) {
      showToast(rtl ? "\u0623\u062f\u062e\u0644 \u0631\u0642\u0645 \u0635\u062d\u064a\u062d" : "Enter a valid number", "error");
      return;
    }
    if (!safeSupa) return;
    var newTotal = (currentCredits || 0) + delta;
    if (newTotal < 0) newTotal = 0;
    try {
      var res = await safeSupa
        .from("profiles")
        .update({ credits: newTotal })
        .eq("id", userId);
      if (res.error) throw res.error;
      showToast(
        (rtl ? "\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062b: " : "Updated: ")
          + (delta > 0 ? "+" : "") + delta + " \u2192 " + newTotal,
        "success"
      );
      /* V2.8 — notify user */
      var creditType = delta > 0 ? "credit_granted" : "credit_deducted";
      var creditIcon = delta > 0 ? "\ud83d\udcb0" : "\ud83d\udcb8";
      var creditTitleAr = delta > 0 ? "\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 \u0631\u0635\u064a\u062f" : "\u062a\u0645 \u062e\u0635\u0645 \u0631\u0635\u064a\u062f";
      var creditTitleEn = delta > 0 ? "Credits added" : "Credits deducted";
      createNotification(userId, creditType,
        creditIcon + " " + (rtl ? creditTitleAr : creditTitleEn),
        (rtl ? "\u062a\u0645 " : "") + (delta > 0 ? "+" : "") + delta + " " + (rtl ? "\u0643\u0631\u064a\u062f\u062a. \u0631\u0635\u064a\u062f\u0643 \u0627\u0644\u062c\u062f\u064a\u062f: " + newTotal : "credits. New balance: " + newTotal));
      setCreditInputs(function (prev) {
        var next = Object.assign({}, prev);
        delete next[userId];
        return next;
      });
      refreshAllUsers();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  /* V2.6 — Change user's plan */
  async function handleChangePlan(userId, planId, userEmail) {
    if (userEmail === "aanour1985@gmail.com") {
      showToast(rtl ? "\u0645\u0627\u064a\u0646\u0641\u0639\u0634 \u062a\u063a\u064a\u0631 \u0628\u0627\u0642\u0629 \u0627\u0644\u0645\u0627\u0644\u0643" : "Cannot change owner's plan", "error");
      return;
    }
    if (!safeSupa) return;
    try {
      var res = await safeSupa
        .from("profiles")
        .update({ plan: planId })
        .eq("id", userId);
      if (res.error) throw res.error;
      showToast((rtl ? "\u062a\u0645 \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0628\u0627\u0642\u0629 \u0625\u0644\u0649 " : "Plan changed to ") + planId, "success");
      /* V2.8 — notify user */
      createNotification(userId, "plan_changed",
        "\ud83d\udce6 " + (rtl ? "\u062a\u0645 \u062a\u063a\u064a\u064a\u0631 \u0628\u0627\u0642\u062a\u0643" : "Your plan was updated"),
        (rtl ? "\u062a\u0645 \u062a\u063a\u064a\u064a\u0631 \u0628\u0627\u0642\u062a\u0643 \u0625\u0644\u0649: " : "Your plan is now: ") + planId);
      refreshAllUsers();
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    }
  }

  async function handleSubmitAppeal() {
    var text = (banAppealText || "").trim();
    if (!text) {
      showToast(rtl ? "\u0627\u0643\u062a\u0628 \u0633\u0628\u0628 \u0637\u0644\u0628\u0643" : "Please write your reason", "error");
      return;
    }
    if (!safeSupa || !user) return;
    setSubmittingAppeal(true);
    try {
      var res = await safeSupa
        .from("contact_messages")
        .insert([{
          user_id: user.id,
          type: "ban_appeal",
          subject: "Ban Appeal from " + user.email,
          message: text,
          status: "new",
        }]);
      if (res.error) throw res.error;
      showToast(rtl ? "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643" : "Appeal sent", "success");
      setBanAppealText("");
    } catch (e) {
      showToast((rtl ? "\u062e\u0637\u0623: " : "Error: ") + (e.message || ""), "error");
    } finally {
      setSubmittingAppeal(false);
    }
  }

  async function saveArticle(toolType, content) {
    if (!content || !content.trim()) return;

    /* Word count: preserve legacy behavior for generate (user's target),
       use actual computed count for other tools */
    var storedWordCount;
    if (toolType === "generate") {
      storedWordCount = wordCount;
    } else {
      storedWordCount = content.trim().split(/\s+/).filter(Boolean).length;
    }

    /* Build descriptive topic per tool */
    var trimmedPaste = (pasteText || "").trim().slice(0, 40);
    var topicLabel;
    switch (toolType) {
      case "generate":
        topicLabel = topic || (rtl ? "\u0628\u062f\u0648\u0646 \u0639\u0646\u0648\u0627\u0646" : "Untitled");
        break;
      case "debate":
        topicLabel = (battleA && battleA.trim() && battleB && battleB.trim())
          ? (battleA + " vs " + battleB)
          : (topic || "Debate");
        break;
      case "roast":     topicLabel = "Roast: " + trimmedPaste; break;
      case "viral":     topicLabel = "Viral Check: " + trimmedPaste; break;
      case "remix":     topicLabel = "Remix: " + trimmedPaste; break;
      case "summary":   topicLabel = "Summary: " + trimmedPaste; break;
      case "titles":    topicLabel = "Titles: " + (trimmedPaste || topic || ""); break;
      case "thread":    topicLabel = "Thread: " + trimmedPaste; break;
      case "linkedin":  topicLabel = "LinkedIn: " + trimmedPaste; break;
      case "repurpose": topicLabel = "Repurpose: " + trimmedPaste; break;
      default:          topicLabel = toolType;
    }

    var newArticle = {
      id: "local_" + Date.now(),
      tool: toolType,
      topic: topicLabel,
      language: language,
      mood: mood,
      era: era,
      word_count: storedWordCount,
      content: content,
      created_at: new Date().toISOString(),
    };

    /* Local state FIRST — guaranteed to work even if DB fails.
       Cap at 100 articles to prevent localStorage overflow. */
    setArticles(function (prev) { return [newArticle].concat(prev).slice(0, 100); });

    /* DB save — best-effort. Preserves existing await behavior for consistency. */
    if (safeDb && user) {
      try {
        await safeDb.saveArticle(user.id, topicLabel, language, mood, era, storedWordCount, content);
      } catch (e) {
        console.error("saveArticle failed:", e);
        /* V2.4 — Surface silent DB failures so we can diagnose */
        var errMsg = (e && e.message) ? e.message : (rtl ? "\u062e\u0637\u0623 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641" : "unknown error");
        showToast(
          (rtl ? "\u26a0\ufe0f \u0641\u0634\u0644 \u062d\u0641\u0638 \u0627\u0644\u0645\u0642\u0627\u0644 \u0641\u064a DB: " : "\u26a0\ufe0f Article DB save failed: ") + errMsg,
          "error"
        );
      }
    }
  }

  async function handleGenerate(toolOverride) {
    var currentTool = toolOverride || activeTool;
    var toolData = TOOLS.find(function (t) { return t.id === currentTool; });
    var cost = toolData ? toolData.cost : 5;

    /* V2.5 — Frozen accounts cannot generate */
    if (user && user.isFrozen) {
      showToast(rtl ? "\u062d\u0633\u0627\u0628\u0643 \u0645\u062c\u0645\u062f. \u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062f\u0639\u0645" : "Your account is frozen. Contact support.", "error");
      return;
    }

    if (credits < cost && !(user && (user.isAdmin || user.email === "aanour1985@gmail.com"))) {
      showToast(t("nomoney"), "error");
      return;
    }
    if (currentTool === "generate" && !topic.trim()) {
      showToast(t("enterTopic"), "error");
      return;
    }
    if (currentTool === "debate" && (!battleA.trim() || !battleB.trim()) && !topic.trim()) {
      showToast(t("fillFields"), "error");
      return;
    }
    if (PASTE_TOOLS.indexOf(currentTool) !== -1 && !pasteText.trim() && currentTool !== "titles") {
      showToast(t("pasteContent"), "error");
      return;
    }

    setGenerating(true);
    setResult("");

    try {
      var resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(currentTool) }),
      });
      if (!resp.ok) {
        showToast((rtl ? "\u0641\u064a\u0647 \u0645\u0634\u0643\u0644\u0629: " : "API Error: ") + resp.status, "error");
        setGenerating(false);
        return;
      }
      var data = await resp.json();

      /* FIX 1: Anthropic returns content as array of blocks — extract text */
      var extractedText = "";
      if (Array.isArray(data.content)) {
        extractedText = data.content
          .map(function (b) { return (b && b.text) ? b.text : ""; })
          .join("\n");
      } else if (typeof data.content === "string") {
        extractedText = data.content;
      }

      if (extractedText && extractedText.trim()) {
        setResult(extractedText);
        if (!(user && (user.isAdmin || user.email === "aanour1985@gmail.com"))) { setCredits(function (prev) { return prev - cost; }); }
        showToast(t("done") + " -" + cost + " credits", "success");

        /* V2.3 — Unified save: now runs for ALL tools (was generate-only before) */
        await saveArticle(currentTool, extractedText);
      } else {
        showToast(data.error || "Error", "error");
      }
    } catch (e) {
      showToast(t("connError") + ": " + (e.message || ""), "error");
      console.error("Generate error:", e);
    }

    setGenerating(false);
  }

  function handleCopy() {
    if (!requirePaid(canCopy, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0646\u0633\u062e" : "Upgrade to copy")) return;
    try {
      navigator.clipboard.writeText(result);
      showToast(t("copied"), "success");
    } catch (e) {}
  }

  /* === COMPUTED === */
  var currentLevel = LEVELS.reduce(function (acc, lv) {
    return ((user && user.xp) || 0) >= lv.xp ? lv : acc;
  }, LEVELS[0]);

  /* #15 Sidebar sections */
  var sidebarSections = [
    {
      title: null,
      items: [{ id: "profile", ic: "\ud83d\udc64" }],
    },
    {
      title: t("services"),
      items: [
        { id: "writer", ic: "\u270d\ufe0f" },
        { id: "roast", ic: "\ud83d\udd25" },
        { id: "battle", ic: "\u2694\ufe0f" },
        { id: "writers", ic: "\ud83d\udc65" },
      ],
    },
    {
      title: t("billing"),
      items: [
        { id: "credits", ic: "\ud83e\ude99" },
        { id: "pricing", ic: "\ud83d\udc8e" },
      ],
    },
    {
      title: t("support"),
      items: [
        { id: "contact", ic: "\ud83d\udce9" },
        { id: "terms", ic: "\ud83d\udcdc" },
      ],
    },
  ];
  var isAdminUser = (user && user.isAdmin) || (user && user.email === "aanour1985@gmail.com");
  var displayCredits = isAdminUser ? "\u221e" : credits;
  if (isAdminUser) {
    sidebarSections.push({
      title: null,
      items: [{ id: "admin", ic: "\ud83d\udee1\ufe0f" }],
    });
  }

  /* === STYLES === */
  var inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid " + TH.border,
    background: TH.card,
    color: TH.text,
    marginBottom: "12px",
    boxSizing: "border-box",
    fontSize: "0.95rem",
    direction: rtl ? "rtl" : "ltr",
    outline: "none",
    transition: "border-color 0.25s",
    fontFamily: "inherit",
  };

  var chipStyle = function (active) {
    return {
      padding: "8px 18px",
      borderRadius: "22px",
      border: active ? "2px solid " + TH.primary : "1px solid " + TH.border,
      background: active ? TH.primary + "18" : TH.card,
      color: active ? TH.primary : TH.textSec,
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: active ? 700 : 500,
      transition: "all 0.25s ease",
    };
  };

  var cardStyle = {
    background: TH.card,
    border: "1px solid " + TH.border,
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "12px",
    transition: "all 0.25s ease",
  };

  var btnBase = {
    transition: "all 0.25s ease",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  var primaryBtn = Object.assign({}, btnBase, {
    background: GRD,
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(91,108,240,0.3)",
  });

  var secondaryBtn = Object.assign({}, btnBase, {
    background: "transparent",
    color: TH.primary,
    border: "2px solid " + TH.primary,
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 700,
  });


  /* ============ RENDER ============ */
  return (
    <div style={{
      minHeight: "100vh",
      background: TH.bg,
      color: TH.text,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      direction: rtl ? "rtl" : "ltr",
    }}>

      {/* ========== NAV ========== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: TH.card + "ee",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid " + TH.border,
        padding: "0 16px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={function () { setShowMenu(!showMenu); }}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
              style={Object.assign({}, btnBase, { background: "none", border: "none", fontSize: "1.3rem", color: TH.text })}
            >{"\u2630"}</button>
            {/* V2.8 — unread badge on hamburger for profile access */}
            {user && unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-2px",
                right: rtl ? undefined : "-4px", left: rtl ? "-4px" : undefined,
                background: "#EF4444", color: "#fff",
                fontSize: "0.6rem", fontWeight: 800,
                padding: "1px 5px", borderRadius: "10px",
                minWidth: "16px", textAlign: "center", pointerEvents: "none",
              }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </div>
          {/* #6 Logo — Muscular Quill mascot */}
          <span
            onClick={function () { navigate("landing"); }}
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontWeight: 800, fontSize: "1.2rem",
              cursor: "pointer", color: TH.text,
              transition: "opacity 0.2s",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}
            onMouseEnter={function (e) { e.currentTarget.style.opacity = "0.75"; }}
            onMouseLeave={function (e) { e.currentTarget.style.opacity = "1"; }}
          >
            <img
              src="/logo.png"
              alt="OxQuill"
              width="30" height="40"
              style={{ objectFit: "contain", flexShrink: 0 }}
            />
            <span>OxQuill</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Credits badge */}
          {user && (
            <span
              onClick={function () { navigate("credits"); }}
              style={{
                fontSize: "0.8rem", color: TH.primary, fontWeight: 700,
                cursor: "pointer", padding: "4px 10px",
                background: TH.primary + "14", borderRadius: "8px",
              }}
            >{displayCredits + " \ud83e\ude99"}</span>
          )}

          {/* V2.8 — Notifications bell (DB-backed) */}
          {user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={function () { setShowNotifs(!showNotifs); }}
                style={Object.assign({}, btnBase, { background: "none", border: "none", fontSize: "1.1rem", position: "relative" })}
              >{"\ud83d\udd14"}</button>
              {unreadCount > 0 && (
                <div style={{
                  position: "absolute", top: "-2px",
                  right: rtl ? undefined : "-2px", left: rtl ? "-2px" : undefined,
                  background: "#EF4444", color: "#fff",
                  fontSize: "0.6rem", fontWeight: 800,
                  padding: "1px 5px", borderRadius: "10px",
                  minWidth: "16px", textAlign: "center", pointerEvents: "none",
                }}>{unreadCount > 9 ? "9+" : unreadCount}</div>
              )}
              {showNotifs && (
                <div style={{
                  position: "absolute", top: "40px",
                  right: rtl ? undefined : 0, left: rtl ? 0 : undefined,
                  width: "280px", background: TH.card,
                  border: "1px solid " + TH.border, borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  zIndex: 200, maxHeight: "360px", overflowY: "auto",
                  direction: rtl ? "rtl" : "ltr",
                }}>
                  <div style={{
                    padding: "14px 16px", borderBottom: "1px solid " + TH.border,
                    fontWeight: 700, fontSize: "0.9rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span>{"\ud83d\udce6 " + (rtl ? "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" : "Notifications")}</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ background: "none", border: "none", color: TH.primary, fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}
                      >{rtl ? "\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0643\u0644" : "Read all"}</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
                      <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{"\ud83d\udd15"}</div>
                      {rtl ? "\u0644\u0627 \u064a\u0648\u062c\u062f \u0625\u0634\u0639\u0627\u0631\u0627\u062a" : "No notifications"}
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(function (nf) {
                      var unread = !nf.is_read;
                      return (
                        <div
                          key={nf.id}
                          onClick={function () { if (unread) markNotificationRead(nf.id); }}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid " + TH.border,
                            cursor: unread ? "pointer" : "default",
                            borderInlineStart: unread ? "3px solid " + TH.primary : undefined,
                            background: unread ? "rgba(91,108,240,0.04)" : "transparent",
                          }}
                        >
                          <div style={{ color: TH.text, fontSize: "0.85rem", fontWeight: unread ? 700 : 500, marginBottom: "2px" }}>
                            {nf.title}
                          </div>
                          {nf.message && (
                            <div style={{ color: TH.textSec, fontSize: "0.75rem", marginBottom: "3px" }}>
                              {nf.message.length > 80 ? nf.message.slice(0, 80) + "..." : nf.message}
                            </div>
                          )}
                          <div style={{ color: TH.textSec, fontSize: "0.7rem" }}>
                            {nf.created_at ? new Date(nf.created_at).toLocaleDateString() : ""}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={function () { setShowNotifs(false); setProfileTab("inbox"); navigate("profile"); }}
                      style={{
                        width: "100%", padding: "12px", border: "none",
                        background: "transparent", color: TH.primary, fontWeight: 600,
                        fontSize: "0.8rem", cursor: "pointer", borderTop: "1px solid " + TH.border,
                      }}
                    >{rtl ? "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644 \u2190" : "View all \u2192"}</button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dark/Light toggle */}
          <button
            onClick={function () { setDarkMode(!darkMode); }}
            onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
            style={Object.assign({}, btnBase, { background: "none", border: "none", fontSize: "1.1rem" })}
          >{darkMode ? "\u2600\ufe0f" : "\ud83c\udf19"}</button>

          {/* Language toggle */}
          <button
            onClick={function () { setRtl(!rtl); }}
            onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
            style={Object.assign({}, btnBase, { background: "none", border: "none", fontSize: "0.8rem", color: TH.textSec, fontWeight: 700 })}
          >{rtl ? "EN" : "AR"}</button>

          {/* Auth button */}
          {user ? (
            <button
              onClick={handleLogout}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
              style={Object.assign({}, btnBase, {
                background: "none", border: "1px solid #EF4444",
                color: "#EF4444", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem",
              })}
            >{t("logout")}</button>
          ) : (
            <button
              onClick={function () { setShowAuth(true); }}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, btnBase, {
                background: TH.primary, border: "none", color: "#fff",
                padding: "6px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700,
              })}
            >{t("login")}</button>
          )}
        </div>
      </nav>

      {/* ========== SIDEBAR #15 ========== */}
      {showMenu && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, bottom: 0, zIndex: 99 }}>
          <div
            onClick={function () { setShowMenu(false); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }}
          />
          <div style={{
            position: "relative", background: TH.card,
            maxWidth: "280px", height: "100%", overflowY: "auto",
            borderRight: rtl ? "none" : "1px solid " + TH.border,
            borderLeft: rtl ? "1px solid " + TH.border : "none",
          }}>
            {/* Profile card at top */}
            {user ? (
              <div
                onClick={function () { navigate("profile"); }}
                style={{
                  padding: "20px", borderBottom: "1px solid " + TH.border,
                  display: "flex", alignItems: "center", gap: "12px",
                  cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: GRD, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", color: "#fff", fontWeight: 800, flexShrink: 0,
                }}>
                  {(user.name || user.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user.name || user.email}</div>
                  <div style={{ fontSize: "0.75rem", color: TH.primary }}>
                    {currentLevel.ic + " " + (rtl ? currentLevel.nA : currentLevel.n) + " \u2022 " + displayCredits + " \ud83e\ude99"}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px", borderBottom: "1px solid " + TH.border, textAlign: "center" }}>
                <button
                  onClick={function () { setShowAuth(true); setShowMenu(false); }}
                  onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                  style={Object.assign({}, primaryBtn, { padding: "10px 28px", fontSize: "0.9rem" })}
                >{t("login")}</button>
              </div>
            )}

            {/* Home */}
            <button
              onClick={function () { navigate("landing"); }}
              style={{
                display: "block", width: "100%", padding: "12px 20px",
                background: view === "landing" ? TH.primary + "18" : "transparent",
                border: "none", color: view === "landing" ? TH.primary : TH.text,
                fontSize: "0.95rem", fontWeight: view === "landing" ? 700 : 500,
                cursor: "pointer", textAlign: rtl ? "right" : "left",
                transition: "all 0.2s", fontFamily: "inherit",
              }}
            >{"\ud83c\udfe0 " + t("home")}</button>

            {/* Sections */}
            {sidebarSections.map(function (section, si) {
              return (
                <div key={si}>
                  {section.title && (
                    <div style={{
                      padding: "12px 20px 4px", fontSize: "0.7rem",
                      fontWeight: 700, color: TH.textSec,
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>{section.title}</div>
                  )}
                  {section.items.map(function (item) {
                    var isActive = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={function () { navigate(item.id); }}
                        style={{
                          display: "block", width: "100%", padding: "10px 20px",
                          background: isActive ? TH.primary + "18" : "transparent",
                          border: "none", color: isActive ? TH.primary : TH.text,
                          fontSize: "0.9rem", fontWeight: isActive ? 700 : 500,
                          cursor: "pointer", textAlign: rtl ? "right" : "left",
                          transition: "all 0.2s", fontFamily: "inherit",
                        }}
                      >{item.ic + " " + t(item.id)}</button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main style={{ paddingTop: "56px", minHeight: "calc(100vh - 140px)" }}>

        {/* ========== LANDING ========== */}
        {view === "landing" && (
          <div>
            {/* Hero */}
            <section style={{
              padding: "80px 20px 50px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-120px", left: "50%",
                transform: "translateX(-50%)", width: "600px", height: "600px",
                background: "radial-gradient(circle, rgba(91,108,240,0.12) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none",
              }} />
              <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
                {/* Hero Mascot — Muscular Quill */}
                <div style={{
                  display: "flex", justifyContent: "center",
                  marginBottom: "20px",
                  animation: "oxFloat 3s ease-in-out infinite",
                }}>
                  <img
                    src="/logo-hero.png"
                    alt="OxQuill Mascot"
                    style={{
                      width: "clamp(140px, 28vw, 220px)",
                      height: "auto",
                      filter: "drop-shadow(0 8px 24px rgba(91,108,240,0.35))",
                    }}
                  />
                </div>
                <style>{"@keyframes oxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }"}</style>

                {/* #13 Hero Superbrain slogan */}
                <h1 style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  fontWeight: 800, lineHeight: 1.25, marginBottom: "16px",
                }}>
                  {rtl ? "\u0643\u0644 \u0643\u0627\u062a\u0628 \u064a\u0633\u062a\u0627\u0647\u0644 " : "Every Writer Deserves a "}
                  <span style={{
                    background: GRD,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>{rtl ? "\u0639\u0642\u0644 \u062e\u0627\u0631\u0642" : "Superbrain"}</span>
                  {t("heroSub")}
                </h1>

                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: TH.textSec,
                  fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                  maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.7,
                }}>{t("heroDesc")}</p>

                {/* Dual CTA */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={function () { user ? navigate("writer") : setShowAuth(true); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
                    style={primaryBtn}
                  >{t("start")}</button>
                  <button
                    onClick={function () { navigate("pricing"); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={secondaryBtn}
                  >{t("plans")}</button>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section style={{
              display: "flex", justifyContent: "center",
              gap: "clamp(20px, 5vw, 50px)", padding: "24px 20px", flexWrap: "wrap",
            }}>
              {[
                { n: "28", l: rtl ? "\u0644\u063a\u0629" : "Languages" },
                { n: "31", l: rtl ? "\u062d\u0642\u0628\u0629" : "Eras" },
                { n: "10", l: rtl ? "\u0623\u062f\u0627\u0629 AI" : "AI Tools" },
                { n: "6", l: rtl ? "\u0646\u0628\u0631\u0627\u062a" : "Moods" },
              ].map(function (stat, i) {
                return (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: "2.2rem", fontWeight: 800,
                      background: GRD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>{stat.n}</div>
                    <div style={{ fontSize: "0.82rem", color: TH.textSec, fontWeight: 600 }}>{stat.l}</div>
                  </div>
                );
              })}
            </section>

            {/* Features Grid */}
            <section style={{ padding: "50px 20px", maxWidth: "920px", margin: "0 auto" }}>
              <h2 style={{
                textAlign: "center", fontFamily: "'Source Serif 4', serif",
                fontSize: "1.5rem", fontWeight: 700, marginBottom: "32px",
              }}>{t("superTools")}</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
              }}>
                {FEATURES.map(function (feat, i) {
                  return (
                    <div
                      key={i}
                      onClick={function () { user ? navigate(feat.go) : setShowAuth(true); }}
                      onMouseEnter={onCardHoverIn} onMouseLeave={onCardHoverOut}
                      style={{
                        background: TH.card, border: "1px solid " + TH.border,
                        borderRadius: "16px", padding: "24px",
                        textAlign: "center", cursor: "pointer",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{feat.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>{rtl ? feat.ar : feat.en}</div>
                      <div style={{ fontSize: "0.75rem", color: TH.textSec }}>{rtl ? feat.descAr : feat.descEn}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: "50px 20px", maxWidth: "840px", margin: "0 auto" }}>
              <h2 style={{
                textAlign: "center", fontFamily: "'Source Serif 4', serif",
                fontSize: "1.4rem", fontWeight: 700, marginBottom: "28px",
              }}>{t("whatSay")}</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "14px",
              }}>
                {TESTIMONIALS.map(function (tm, i) {
                  return (
                    <div key={i} style={{
                      background: TH.card, border: "1px solid " + TH.border,
                      borderRadius: "16px", padding: "24px",
                    }}>
                      <div style={{ marginBottom: "10px" }}>{"\u2b50".repeat(tm.stars)}</div>
                      <p style={{
                        color: TH.textSec, fontSize: "0.9rem",
                        lineHeight: 1.6, fontStyle: "italic", marginBottom: "16px",
                      }}>
                        {"\"" + (rtl ? tm.textAr : tm.text) + "\""}
                      </p>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{rtl ? tm.nameAr : tm.name}</div>
                      <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>{rtl ? tm.roleAr : tm.role}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bottom CTA */}
            <section style={{ padding: "50px 20px", textAlign: "center" }}>
              <div style={{
                background: GRD, borderRadius: "24px",
                padding: "48px 28px", maxWidth: "640px", margin: "0 auto",
              }}>
                <h2 style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "12px",
                }}>{t("readyCTA")}</h2>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "24px", fontSize: "1rem" }}>
                  {t("freeCredits")}
                </p>
                <button
                  onClick={function () { user ? navigate("writer") : setShowAuth(true); }}
                  onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
                  style={Object.assign({}, btnBase, {
                    background: "#fff", color: TH.primary, border: "none",
                    padding: "14px 40px", borderRadius: "12px",
                    fontSize: "1.05rem", fontWeight: 700,
                  })}
                >{t("getStarted")}</button>
              </div>
            </section>
          </div>
        )}

        {/* ========== WRITER ========== */}
        {view === "writer" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "750px", margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.5rem",
              fontWeight: 700, textAlign: "center", marginBottom: "24px",
            }}>{"\u270d\ufe0f " + t("superWriter")}</h1>

            {/* Tool selector */}
            <div style={{
              display: "flex", gap: "6px", flexWrap: "wrap",
              justifyContent: "center", marginBottom: "24px",
            }}>
              {TOOLS.map(function (tl) {
                var isActive = activeTool === tl.id;
                return (
                  <button
                    key={tl.id}
                    onClick={function () { setActiveTool(tl.id); setResult(""); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, chipStyle(isActive), btnBase)}
                  >
                    {tl.icon + " " + (rtl ? tl.ar : tl.en) + " (" + tl.cost + ")"}
                  </button>
                );
              })}
            </div>

            {/* Topic input */}
            {(activeTool === "generate" || activeTool === "debate" || activeTool === "titles") && (
              <input
                value={topic}
                onChange={function (e) { setTopic(e.target.value); }}
                placeholder={t("topic")}
                style={inputStyle}
              />
            )}

            {/* Paste input */}
            {PASTE_TOOLS.indexOf(activeTool) !== -1 && (
              <textarea
                value={pasteText}
                onChange={function (e) { setPasteText(e.target.value); }}
                placeholder={t("paste")}
                rows={6}
                style={Object.assign({}, inputStyle, { resize: "vertical", lineHeight: 1.7 })}
              />
            )}

            {/* FIX: Language (+mood for remix) for paste tools */}
            {PASTE_TOOLS.indexOf(activeTool) !== -1 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: activeTool === "remix" ? "repeat(auto-fit, minmax(160px, 1fr))" : "1fr",
                gap: "12px", marginBottom: "20px",
              }}>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\ud83c\udf0d " + t("language")}
                  </label>
                  <select value={language} onChange={function (e) { setLanguage(e.target.value); }} style={inputStyle}>
                    {LANGUAGES.map(function (l) { return <option key={l} value={l}>{flag(l) + l}</option>; })}
                  </select>
                </div>
                {activeTool === "remix" && (
                  <div>
                    <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                      {"\ud83c\udfad " + t("mood")}
                    </label>
                    <select value={mood} onChange={function (e) { setMood(e.target.value); }} style={inputStyle}>
                      {MOOD_LIST.map(function (m) { return <option key={m} value={m}>{(MOOD_EMOJI[m] || "") + " " + (rtl ? (MOOD_AR[m] || m) : m)}</option>; })}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Generate options grid */}
            {activeTool === "generate" && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px", marginBottom: "20px",
              }}>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\ud83c\udf0d " + t("language")}
                  </label>
                  <select value={language} onChange={function (e) { setLanguage(e.target.value); }} style={inputStyle}>
                    {LANGUAGES.map(function (l) { return <option key={l} value={l}>{flag(l) + l}</option>; })}
                  </select>
                </div>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\ud83c\udfad " + t("mood")}
                  </label>
                  <select value={mood} onChange={function (e) { setMood(e.target.value); }} style={inputStyle}>
                    {MOOD_LIST.map(function (m) { return <option key={m} value={m}>{(MOOD_EMOJI[m] || "") + " " + (rtl ? (MOOD_AR[m] || m) : m)}</option>; })}
                  </select>
                </div>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\u23f3 " + t("timeMachine")}
                  </label>
                  <select value={era} onChange={function (e) { setEra(e.target.value); }} style={inputStyle}>
                    {ERA_LIST.map(function (e) { return <option key={e} value={e}>{e}</option>; })}
                  </select>
                </div>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\ud83d\udcdd " + t("words") + ": " + wordCount}
                  </label>
                  <input
                    type="range" min={200} max={5000} step={100}
                    value={wordCount}
                    onChange={function (e) { setWordCount(Number(e.target.value)); }}
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                </div>
                <div>
                  <label style={{ color: TH.textSec, fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                    {"\ud83d\udc64 " + t("gender")}
                  </label>
                  <select value={gender} onChange={function (e) { setGender(e.target.value); }} style={inputStyle}>
                    <option value="neutral">{t("neutral")}</option>
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={function () { handleGenerate(); }}
              disabled={generating}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, btnBase, {
                width: "100%", padding: "16px", borderRadius: "14px", border: "none",
                background: generating ? TH.border : GRD, color: "#fff",
                fontSize: "1.05rem", fontWeight: 700,
                cursor: generating ? "wait" : "pointer",
              })}
            >
              {generating
                ? ("\u23f3 " + t("loading"))
                : ("\ud83d\ude80 " + t("generate") + " (" + ((TOOLS.find(function (t) { return t.id === activeTool; }) || {}).cost || 5) + " \ud83e\ude99)")
              }
            </button>

            {/* Result */}
            {result && (
              <div style={Object.assign({}, cardStyle, { marginTop: "24px", position: "relative" })}>
                {/* #8 Watermark — FIX: tiled repeating "OX" pattern across entire article */}
                {hasWatermark && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: "none", zIndex: 1, overflow: "hidden",
                    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='120'><text x='50%' y='50%' font-family='Plus Jakarta Sans, sans-serif' font-size='32' font-weight='900' fill='" + (darkMode ? "rgb(155,123,240)" : "rgb(91,108,240)") + "' fill-opacity='" + (darkMode ? "0.18" : "0.17") + "' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 90 60)' letter-spacing='3'>OX</text></svg>\")",
                    backgroundRepeat: "repeat",
                    backgroundSize: "180px 120px",
                  }} />
                )}

                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "16px",
                  position: "relative", zIndex: 2,
                }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>{t("result")}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Download — FIX: gated for free (canCopy controls download too) */}
                    <button
                      onClick={function () {
                        if (!requirePaid(canCopy, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u062a\u062d\u0645\u064a\u0644" : "Upgrade to download")) return;
                        var content = result;
                        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        a.href = url; a.download = "oxquill-article.txt";
                        document.body.appendChild(a); a.click();
                        document.body.removeChild(a); URL.revokeObjectURL(url);
                        showToast(rtl ? "\u062a\u0645 \u0627\u0644\u062a\u062d\u0645\u064a\u0644!" : "Downloaded!", "success");
                      }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        background: canCopy ? "rgba(245,158,11,0.12)" : "rgba(148,163,184,0.12)",
                        border: "1px solid " + (canCopy ? "#F59E0B" : "#94A3B8"),
                        color: canCopy ? "#F59E0B" : "#94A3B8",
                        padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem",
                        fontWeight: 600,
                      })}
                    >{"\ud83d\udcc4 " + (rtl ? "\u062a\u062d\u0645\u064a\u0644" : "Download") + (canCopy ? "" : " \ud83d\udd12")}</button>
                    {/* #9 Copy — FIX: locked visual for free users */}
                    <button
                      onClick={handleCopy}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        background: canCopy ? (TH.primary + "18") : "rgba(148,163,184,0.12)",
                        border: "1px solid " + (canCopy ? TH.primary : "#94A3B8"),
                        color: canCopy ? TH.primary : "#94A3B8",
                        padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem",
                        fontWeight: 600,
                      })}
                    >{"\ud83d\udccb " + t("copy") + (canCopy ? "" : " \ud83d\udd12")}</button>
                    {/* #9 Share — FIX: always visible; free users see upgrade prompt */}
                    <button
                      onClick={function () {
                        if (!requirePaid(canShare, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629" : "Upgrade your plan to share")) return;
                        setShowShare(true);
                      }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        background: canShare ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.12)",
                        border: "1px solid " + (canShare ? "#22C55E" : "#94A3B8"),
                        color: canShare ? "#22C55E" : "#94A3B8",
                        padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem",
                        fontWeight: 600,
                      })}
                    >{"\ud83d\udce4 " + t("share") + (canShare ? "" : " \ud83d\udd12")}</button>
                  </div>
                </div>

                <div style={{
                  lineHeight: 1.8, whiteSpace: "pre-wrap",
                  direction: rtl ? "rtl" : "ltr",
                  position: "relative", zIndex: 2,
                  userSelect: canCopy ? "auto" : "none", WebkitUserSelect: canCopy ? "auto" : "none", /* #9 */
                  fontSize: "0.95rem",
                }}>{result}</div>
              </div>
            )}
          </div>
        )}

        {/* ========== ROAST #14 standalone, #1 multilang ========== */}
        {view === "roast" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "660px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "8px" }}>{"\ud83d\udd25"}</div>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.6rem",
              fontWeight: 800, marginBottom: "8px",
            }}>{t("roastTitle")}</h1>
            <p style={{ color: TH.textSec, fontSize: "0.95rem", marginBottom: "20px" }}>
              {t("roastSub") + " \ud83d\udd25"}
            </p>

            {/* #1 Roast language selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ color: TH.textSec, fontSize: "0.85rem", marginRight: "8px" }}>
                {t("language") + ": "}
              </label>
              <select
                value={language}
                onChange={function (e) { setLanguage(e.target.value); }}
                style={Object.assign({}, inputStyle, { width: "auto", display: "inline-block", marginBottom: 0, padding: "10px 14px" })}
              >
                {LANGUAGES.map(function (l) { return <option key={l} value={l}>{flag(l) + l}</option>; })}
              </select>
            </div>

            {/* Level selector */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
              {[
                { id: "gentle", e: "\ud83d\ude0f" },
                { id: "medium", e: "\ud83d\udd25" },
                { id: "savage", e: "\ud83d\udc80" },
              ].map(function (lv) {
                var isActive = roastLevel === lv.id;
                return (
                  <button
                    key={lv.id}
                    onClick={function () { setRoastLevel(lv.id); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, chipStyle(isActive), btnBase,
                      isActive ? { borderColor: "#EF4444", color: "#EF4444", background: "rgba(239,68,68,0.08)" } : {}
                    )}
                  >{lv.e + " " + t(lv.id)}</button>
                );
              })}
            </div>

            {/* Paste area */}
            <textarea
              value={pasteText}
              onChange={function (e) { setPasteText(e.target.value); }}
              placeholder={t("paste")}
              rows={8}
              style={Object.assign({}, inputStyle, { textAlign: "left", resize: "vertical", lineHeight: 1.7 })}
            />

            {/* Word count + cost */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", margin: "8px 0 16px",
            }}>
              <span style={{ color: TH.textSec, fontSize: "0.85rem" }}>
                {pasteText.split(/\s+/).filter(Boolean).length + " " + t("words")}
              </span>
              <span style={{ color: TH.textSec, fontSize: "0.85rem" }}>
                {"2 \ud83e\ude99"}
              </span>
            </div>

            {/* Roast button */}
            <button
              onClick={function () {
                if (!pasteText.trim()) { showToast(t("pasteContent"), "error"); return; }
                setActiveTool("roast");
                handleGenerate("roast");
              }}
              disabled={generating}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, btnBase, {
                width: "100%", padding: "16px", borderRadius: "14px", border: "none",
                background: generating ? TH.border : "linear-gradient(135deg, #EF4444, #F97316)",
                color: "#fff", fontSize: "1.1rem", fontWeight: 700,
                cursor: generating ? "wait" : "pointer",
              })}
            >
              {generating ? ("\ud83d\udd25 " + t("roasting")) : ("\ud83d\udd25 " + t("roastBtn") + " (2 \ud83e\ude99)")}
            </button>

            {/* Result */}
            {result && (
              <div style={Object.assign({}, cardStyle, { marginTop: "24px", textAlign: "left", position: "relative", overflow: "hidden" })}>
                {/* V2.3 — Tiled OX watermark overlay (matches Writer) */}
                {hasWatermark && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: "none", zIndex: 1, overflow: "hidden",
                    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='120'><text x='50%' y='50%' font-family='Plus Jakarta Sans, sans-serif' font-size='32' font-weight='900' fill='" + (darkMode ? "rgb(155,123,240)" : "rgb(91,108,240)") + "' fill-opacity='" + (darkMode ? "0.18" : "0.17") + "' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 90 60)' letter-spacing='3'>OX</text></svg>\")",
                    backgroundRepeat: "repeat",
                    backgroundSize: "180px 120px",
                  }} />
                )}
                <h3 style={{ color: "#EF4444", fontWeight: 700, marginBottom: "16px", fontSize: "1.1rem", position: "relative", zIndex: 2 }}>
                  {"\ud83d\udd25 " + t("roastResults")}
                </h3>
                <div data-result style={{
                  lineHeight: 1.8, whiteSpace: "pre-wrap",
                  direction: rtl ? "rtl" : "ltr",
                  userSelect: canCopy ? "auto" : "none", WebkitUserSelect: canCopy ? "auto" : "none",
                  fontSize: "0.95rem",
                  position: "relative", zIndex: 2,
                }}>{result}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
                  {/* Download */}
                  <button
                    onClick={function () {
                      if (!requirePaid(canCopy, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u062a\u062d\u0645\u064a\u0644" : "Upgrade to download")) return;
                      var b = new Blob([result], { type: "text/plain;charset=utf-8" });
                      var u = URL.createObjectURL(b);
                      var a = document.createElement("a");
                      a.href = u; a.download = "oxquill-roast.txt";
                      document.body.appendChild(a); a.click();
                      document.body.removeChild(a); URL.revokeObjectURL(u);
                      showToast(rtl ? "\u062a\u0645!" : "Downloaded!", "success");
                    }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canCopy ? "rgba(245,158,11,0.12)" : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canCopy ? "#F59E0B" : "#94A3B8"),
                      color: canCopy ? "#F59E0B" : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udcc4 " + (rtl ? "\u062a\u062d\u0645\u064a\u0644" : "Download") + (canCopy ? "" : " \ud83d\udd12")}</button>
                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canCopy ? (TH.primary + "18") : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canCopy ? TH.primary : "#94A3B8"),
                      color: canCopy ? TH.primary : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udccb " + t("copy") + (canCopy ? "" : " \ud83d\udd12")}</button>
                  {/* Share */}
                  <button
                    onClick={function () {
                      if (!requirePaid(canShare, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629" : "Upgrade your plan to share")) return;
                      setShowShare(true);
                    }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canShare ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canShare ? "#22C55E" : "#94A3B8"),
                      color: canShare ? "#22C55E" : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udd17 " + t("share") + (canShare ? "" : " \ud83d\udd12")}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== BATTLE #1 multilang ========== */}
        {view === "battle" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "660px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "8px" }}>{"\u2694\ufe0f"}</div>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.6rem",
              fontWeight: 800, marginBottom: "16px",
            }}>{t("battleTitle")}</h1>

            {/* #1 Battle language */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: TH.textSec, fontSize: "0.85rem", marginRight: "8px" }}>
                {t("language") + ": "}
              </label>
              <select
                value={language}
                onChange={function (e) { setLanguage(e.target.value); }}
                style={Object.assign({}, inputStyle, { width: "auto", display: "inline-block", marginBottom: 0, padding: "10px 14px" })}
              >
                {LANGUAGES.map(function (l) { return <option key={l} value={l}>{flag(l) + l}</option>; })}
              </select>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr",
              gap: "12px", alignItems: "center", marginBottom: "24px",
            }}>
              <input value={battleA} onChange={function (e) { setBattleA(e.target.value); }} placeholder={t("sideA")} style={inputStyle} />
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#EF4444" }}>VS</span>
              <input value={battleB} onChange={function (e) { setBattleB(e.target.value); }} placeholder={t("sideB")} style={inputStyle} />
            </div>

            <button
              onClick={function () {
                if (!battleA.trim() || !battleB.trim()) {
                  showToast(t("fillFields"), "error");
                  return;
                }
                setActiveTool("debate");
                handleGenerate("debate");
              }}
              disabled={generating}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, btnBase, {
                width: "100%", padding: "16px", borderRadius: "14px", border: "none",
                background: generating ? TH.border : "linear-gradient(135deg, #EF4444, #8B5CF6)",
                color: "#fff", fontSize: "1.1rem", fontWeight: 700,
                cursor: generating ? "wait" : "pointer",
              })}
            >
              {generating ? ("\u2694\ufe0f " + t("battleInProgress")) : ("\u2694\ufe0f " + t("battleBtn") + " (6 \ud83e\ude99)")}
            </button>

            {result && (
              <div style={Object.assign({}, cardStyle, { marginTop: "24px", textAlign: "left", position: "relative", overflow: "hidden" })}>
                {/* V2.3 — Tiled OX watermark overlay (matches Writer) */}
                {hasWatermark && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: "none", zIndex: 1, overflow: "hidden",
                    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='120'><text x='50%' y='50%' font-family='Plus Jakarta Sans, sans-serif' font-size='32' font-weight='900' fill='" + (darkMode ? "rgb(155,123,240)" : "rgb(91,108,240)") + "' fill-opacity='" + (darkMode ? "0.18" : "0.17") + "' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 90 60)' letter-spacing='3'>OX</text></svg>\")",
                    backgroundRepeat: "repeat",
                    backgroundSize: "180px 120px",
                  }} />
                )}
                <div data-result style={{
                  lineHeight: 1.8, whiteSpace: "pre-wrap",
                  direction: rtl ? "rtl" : "ltr",
                  userSelect: canCopy ? "auto" : "none", WebkitUserSelect: canCopy ? "auto" : "none",
                  fontSize: "0.95rem",
                  position: "relative", zIndex: 2,
                }}>{result}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
                  {/* Download */}
                  <button
                    onClick={function () {
                      if (!requirePaid(canCopy, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u062a\u062d\u0645\u064a\u0644" : "Upgrade to download")) return;
                      var b = new Blob([result], { type: "text/plain;charset=utf-8" });
                      var u = URL.createObjectURL(b);
                      var a = document.createElement("a");
                      a.href = u; a.download = "oxquill-battle.txt";
                      document.body.appendChild(a); a.click();
                      document.body.removeChild(a); URL.revokeObjectURL(u);
                      showToast(rtl ? "\u062a\u0645!" : "Downloaded!", "success");
                    }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canCopy ? "rgba(245,158,11,0.12)" : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canCopy ? "#F59E0B" : "#94A3B8"),
                      color: canCopy ? "#F59E0B" : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udcc4 " + (rtl ? "\u062a\u062d\u0645\u064a\u0644" : "Download") + (canCopy ? "" : " \ud83d\udd12")}</button>
                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canCopy ? (TH.primary + "18") : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canCopy ? TH.primary : "#94A3B8"),
                      color: canCopy ? TH.primary : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udccb " + t("copy") + (canCopy ? "" : " \ud83d\udd12")}</button>
                  {/* Share */}
                  <button
                    onClick={function () {
                      if (!requirePaid(canShare, rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629" : "Upgrade your plan to share")) return;
                      setShowShare(true);
                    }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, btnBase, {
                      background: canShare ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.12)",
                      border: "1px solid " + (canShare ? "#22C55E" : "#94A3B8"),
                      color: canShare ? "#22C55E" : "#94A3B8",
                      padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    })}
                  >{"\ud83d\udd17 " + t("share") + (canShare ? "" : " \ud83d\udd12")}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== PROFILE ========== */}
        {view === "profile" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "660px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: GRD, display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: "2rem", color: "#fff", fontWeight: 800,
              }}>
                {user ? (user.name || user.email || "?").charAt(0).toUpperCase() : "?"}
              </div>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem" }}>
                {user ? (user.name || user.email) : "Guest"}
              </h2>
              <p style={{ color: TH.textSec, fontSize: "0.9rem" }}>
                {currentLevel.ic + " " + (rtl ? currentLevel.nA : currentLevel.n)}
              </p>
            </div>

            {/* V2.7 — Prominent stats strip */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "24px",
            }}>
              <div style={Object.assign({}, cardStyle, { textAlign: "center", padding: "14px 8px" })}>
                <div style={{ fontSize: "1.4rem" }}>{"\ud83d\udcc4"}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22C55E" }}>{articles.length}</div>
                <div style={{ fontSize: "0.7rem", color: TH.textSec }}>
                  {rtl ? "\u0645\u0642\u0627\u0644\u0627\u062a" : "Articles"}
                </div>
              </div>
              <div style={Object.assign({}, cardStyle, { textAlign: "center", padding: "14px 8px" })}>
                <div style={{ fontSize: "1.4rem" }}>{"\ud83e\ude99"}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F59E0B" }}>{displayCredits}</div>
                <div style={{ fontSize: "0.7rem", color: TH.textSec }}>{t("credits")}</div>
              </div>
              <div style={Object.assign({}, cardStyle, { textAlign: "center", padding: "14px 8px" })}>
                <div style={{ fontSize: "1.4rem" }}>{"\ud83c\udfc6"}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3B82F6" }}>{(user && user.xp) || 0}</div>
                <div style={{ fontSize: "0.7rem", color: TH.textSec }}>{"XP"}</div>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
              {[
                { id: "info", label: t("myInfo"), ic: "\ud83d\udc64" },
                { id: "articles", label: t("myArticles"), ic: "\ud83d\udcc4" },
                { id: "inbox", label: (rtl ? "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" : "Inbox"), ic: "\ud83d\udce6", badge: unreadCount },
                { id: "levels", label: t("levels"), ic: "\ud83c\udfc6" },
                { id: "settings", label: t("settings"), ic: "\u2699\ufe0f" },
              ].map(function (tab) {
                var isActive = profileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={function () { setProfileTab(tab.id); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, chipStyle(isActive), btnBase, {
                      flex: 1, fontSize: "0.78rem", whiteSpace: "nowrap",
                      position: "relative",
                    })}
                  >
                    {tab.ic + " " + tab.label}
                    {tab.badge > 0 && (
                      <span style={{
                        position: "absolute", top: "-4px",
                        right: rtl ? undefined : "-4px", left: rtl ? "-4px" : undefined,
                        background: "#EF4444", color: "#fff",
                        fontSize: "0.65rem", fontWeight: 800,
                        padding: "1px 6px", borderRadius: "10px",
                        minWidth: "18px", textAlign: "center",
                      }}>{tab.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Info tab */}
            {profileTab === "info" && (
              <div style={cardStyle}>
                {[
                  { l: t("name"), v: user ? (user.name || "-") : "-" },
                  { l: t("email"), v: user ? (user.email || "-") : "-" },
                  { l: t("credits"), v: displayCredits },
                  { l: t("levels"), v: currentLevel.ic + " " + (rtl ? currentLevel.nA : currentLevel.n) },
                  { l: "XP", v: (user && user.xp) || 0 },
                  { l: t("myArticles"), v: articles.length },
                ].map(function (row, i) {
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: i < 5 ? "1px solid " + TH.border : "none",
                    }}>
                      <span style={{ color: TH.textSec, fontSize: "0.9rem" }}>{row.l}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{row.v}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Articles tab */}
            {profileTab === "articles" && (
              <div>
                {articles.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 20px", color: TH.textSec }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{"\ud83d\udced"}</div>
                    <p>{t("noArticles")}</p>
                    <button
                      onClick={function () { navigate("writer"); }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        marginTop: "16px", background: GRD, color: "#fff",
                        border: "none", padding: "10px 24px", borderRadius: "10px",
                        fontWeight: 700,
                      })}
                    >{t("start")}</button>
                  </div>
                ) : (
                  articles.map(function (art, i) {
                    return (
                      <div
                        key={i}
                        onClick={function () { setOpenArticle(art); }}
                        onMouseEnter={onCardHoverIn} onMouseLeave={onCardHoverOut}
                        style={{
                          background: TH.card, border: "1px solid " + TH.border,
                          borderRadius: "12px", padding: "16px", marginBottom: "10px",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
                              {art.title || art.topic || (rtl ? "\u0645\u0642\u0627\u0644" : "Article")}
                            </div>
                            <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                              {(art.language || "") + " \u2022 " + (art.mood ? ((MOOD_EMOJI[art.mood] ? MOOD_EMOJI[art.mood] + " " : "") + (rtl ? (MOOD_AR[art.mood] || art.mood) : art.mood)) : "-") + " \u2022 " + (art.word_count || "?") + " " + t("words")}
                            </div>
                          </div>
                          <div style={{ color: TH.primary, fontSize: "1.2rem", flexShrink: 0 }}>{"\u203a"}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* V2.8 — Inbox/Notifications tab */}
            {profileTab === "inbox" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <h3 style={{ fontWeight: 700 }}>
                    {"\ud83d\udce6 " + (rtl ? "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a" : "Inbox")}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        padding: "6px 12px", borderRadius: "8px",
                        border: "1px solid " + TH.primary, background: "transparent",
                        color: TH.primary, fontSize: "0.75rem", fontWeight: 600,
                      })}
                    >{rtl ? "\u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621" : "Mark all read"}</button>
                  )}
                </div>

                {loadingNotifs && (
                  <div style={Object.assign({}, cardStyle, { textAlign: "center" })}>
                    <p style={{ color: TH.textSec }}>{"\u23f3 " + (rtl ? "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644..." : "Loading...")}</p>
                  </div>
                )}

                {!loadingNotifs && notifications.length === 0 && (
                  <div style={Object.assign({}, cardStyle, { textAlign: "center", padding: "48px 20px" })}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{"\ud83d\udce6"}</div>
                    <p style={{ fontWeight: 600, marginBottom: "6px" }}>
                      {rtl ? "\u0644\u0627 \u064a\u0648\u062c\u062f \u0625\u0634\u0639\u0627\u0631\u0627\u062a" : "No notifications"}
                    </p>
                    <p style={{ color: TH.textSec, fontSize: "0.85rem" }}>
                      {rtl ? "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a \u0627\u0644\u062c\u062f\u064a\u062f\u0629 \u0647\u062a\u0638\u0647\u0631 \u0647\u0646\u0627" : "New notifications will appear here"}
                    </p>
                  </div>
                )}

                {!loadingNotifs && notifications.map(function (n) {
                  var unread = !n.is_read;
                  return (
                    <div
                      key={n.id}
                      onClick={function () { if (unread) markNotificationRead(n.id); }}
                      style={Object.assign({}, cardStyle, {
                        marginBottom: "10px", cursor: unread ? "pointer" : "default",
                        borderInlineStart: unread ? ("3px solid " + TH.primary) : undefined,
                        opacity: unread ? 1 : 0.75,
                        position: "relative",
                      })}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                          <div style={{ fontWeight: unread ? 700 : 500, fontSize: "0.9rem", marginBottom: "4px" }}>
                            {n.title}
                          </div>
                          {n.message && (
                            <div style={{ fontSize: "0.82rem", color: TH.textSec, whiteSpace: "pre-wrap" }}>
                              {n.message}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                          {unread && (
                            <span style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: "#EF4444",
                            }} />
                          )}
                          <span style={{ fontSize: "0.7rem", color: TH.textSec, whiteSpace: "nowrap" }}>
                            {n.created_at ? new Date(n.created_at).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Levels tab */}
            {profileTab === "levels" && (
              <div>
                {LEVELS.map(function (lv, i) {
                  var userXP = (user && user.xp) || 0;
                  var reached = userXP >= lv.xp;
                  var isCurrent = currentLevel.lv === lv.lv;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "14px", borderRadius: "12px", marginBottom: "8px",
                      background: isCurrent ? "rgba(91,108,240,0.08)" : reached ? TH.card : "transparent",
                      border: isCurrent ? "2px solid #5B6CF0" : "1px solid " + (reached ? TH.border : "transparent"),
                      opacity: reached ? 1 : 0.5,
                    }}>
                      <div style={{ fontSize: "1.5rem" }}>{lv.ic}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                          {(rtl ? "\u0645\u0633\u062a\u0648\u0649 " : "Level ") + lv.lv + " \u2014 " + (rtl ? lv.nA : lv.n)}
                        </div>
                        <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>
                          {lv.xp + " XP \u2022 " + (rtl ? lv.rw.ar : lv.rw.en)}
                        </div>
                      </div>
                      {reached && <span style={{ color: "#22C55E", fontWeight: 700 }}>{"\u2713"}</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Settings tab */}
            {profileTab === "settings" && (
              <div style={Object.assign({}, cardStyle, { textAlign: "center", color: TH.textSec })}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{"\u2699\ufe0f"}</div>
                <p>{t("comingSoon")}</p>
              </div>
            )}
          </div>
        )}

        {/* ========== ADMIN #3 ban/freeze, #16 messages, #17 API usage ========== */}
        {view === "admin" && isAdminUser && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.4rem",
              fontWeight: 700, textAlign: "center", marginBottom: "24px",
            }}>{"\ud83d\udee1\ufe0f " + t("admin")}</h1>

            {/* Admin tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
              {[
                { id: "dashboard", l: t("dashboard"), ic: "\ud83d\udcca" },
                { id: "users", l: t("users"), ic: "\ud83d\udc65" },
                { id: "messages", l: t("messages"), ic: "\ud83d\udce9", badge: unreadMessagesCount },
              ].map(function (tab) {
                return (
                  <button
                    key={tab.id}
                    onClick={function () { setAdminTab(tab.id); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, chipStyle(adminTab === tab.id), btnBase, {
                      flex: 1, position: "relative",
                    })}
                  >
                    {tab.ic + " " + tab.l}
                    {tab.badge > 0 && (
                      <span style={{
                        position: "absolute", top: "-4px",
                        right: rtl ? undefined : "-4px", left: rtl ? "-4px" : undefined,
                        background: "#EF4444", color: "#fff",
                        fontSize: "0.65rem", fontWeight: 800,
                        padding: "1px 6px", borderRadius: "10px",
                        minWidth: "18px", textAlign: "center",
                      }}>{tab.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dashboard */}
            {adminTab === "dashboard" && (
              <div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px", marginBottom: "24px",
                }}>
                  {[
                    { l: t("users"), v: loadingStats ? "..." : String(adminStats.users), ic: "\ud83d\udc65", c: "#3B82F6", tab: "users" },
                    { l: (rtl ? "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" : "Total Articles"), v: loadingStats ? "..." : String(adminStats.articles), ic: "\ud83d\udcc4", c: "#22C55E", tab: null },
                    { l: (rtl ? "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0643\u0631\u064a\u062f\u062a\u0633" : "Total Credits"), v: loadingStats ? "..." : String(adminStats.credits), ic: "\ud83d\udcb0", c: "#F59E0B", tab: null },
                  ].map(function (stat, i) {
                    var clickable = !!stat.tab;
                    return (
                      <div
                        key={i}
                        onClick={clickable ? function () { setAdminTab(stat.tab); } : undefined}
                        onMouseEnter={clickable ? onCardHoverIn : undefined}
                        onMouseLeave={clickable ? onCardHoverOut : undefined}
                        style={Object.assign({}, cardStyle, {
                          textAlign: "center",
                          cursor: clickable ? "pointer" : "default",
                          transition: clickable ? "all 0.2s" : undefined,
                        })}
                      >
                        <div style={{ fontSize: "1.4rem" }}>{stat.ic}</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: stat.c }}>{stat.v}</div>
                        <div style={{ fontSize: "0.8rem", color: TH.textSec }}>
                          {stat.l + (clickable ? " \u2192" : "")}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* #17 Claude API Usage card */}
                <div style={cardStyle}>
                  <h3 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "1rem" }}>
                    {"\ud83e\udd16 " + (rtl ? "\u0627\u0633\u062a\u0647\u0644\u0627\u0643 Claude API" : "Claude API Usage")}
                  </h3>

                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "14px", borderRadius: "12px", marginBottom: "14px",
                    background: apiBalance < 2 ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                  }}>
                    <div>
                      <div style={{ color: TH.textSec, fontSize: "0.8rem" }}>{rtl ? "\u0631\u0635\u064a\u062f Anthropic" : "Anthropic Balance"}</div>
                      <div style={{
                        fontWeight: 800, fontSize: "1.4rem",
                        color: apiBalance < 2 ? "#EF4444" : "#22C55E",
                      }}>{"$" + apiBalance.toFixed(2)}</div>
                    </div>
                    {apiBalance < 2 && (
                      <span style={{
                        background: "#EF4444", color: "#fff",
                        padding: "6px 12px", borderRadius: "8px",
                        fontSize: "0.75rem", fontWeight: 700, alignSelf: "center",
                      }}>{"\u26a0\ufe0f " + (rtl ? "\u0645\u0646\u062e\u0641\u0636!" : "LOW!")}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      value={balanceInput}
                      onChange={function (e) { setBalanceInput(e.target.value); }}
                      placeholder="$" type="number"
                      style={Object.assign({}, inputStyle, { flex: 1, marginBottom: 0 })}
                    />
                    <button
                      onClick={function () {
                        var v = parseFloat(balanceInput);
                        if (!isNaN(v) && v >= 0) {
                          setApiBalance(v);
                          setBalanceInput("");
                          showToast(rtl ? "\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062b" : "Updated", "success");
                        }
                      }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        padding: "12px 20px", borderRadius: "10px",
                        border: "none", background: TH.primary,
                        color: "#fff", fontWeight: 700,
                      })}
                    >{rtl ? "\u062a\u062d\u062f\u064a\u062b" : "Update"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* #3 Users with ban/freeze */}
            {adminTab === "users" && (
              <div>
                {/* Header + Search */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <h3 style={{ fontWeight: 700 }}>
                    {rtl ? "\ud83d\udc65 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646" : "\ud83d\udc65 Users"}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: TH.textSec }}>
                    {allUsers.length + " " + (rtl ? "\u0645\u0633\u062a\u062e\u062f\u0645" : "users")}
                  </span>
                </div>
                <input
                  value={userSearch}
                  onChange={function (e) { setUserSearch(e.target.value); }}
                  placeholder={rtl ? "\u0628\u062d\u062b \u0628\u0627\u0644\u0625\u064a\u0645\u064a\u0644..." : "Search by email..."}
                  style={Object.assign({}, inputStyle, { marginBottom: "14px" })}
                />

                {loadingUsers && (
                  <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
                    {rtl ? "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644..." : "Loading..."}
                  </p>
                )}

                {!loadingUsers && allUsers.length === 0 && (
                  <div style={Object.assign({}, cardStyle, { textAlign: "center" })}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{"\ud83d\udc65"}</div>
                    <p style={{ fontWeight: 600, marginBottom: "6px" }}>
                      {rtl ? "\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646" : "No users"}
                    </p>
                  </div>
                )}

                {!loadingUsers && allUsers
                  .filter(function (u) {
                    if (!userSearch.trim()) return true;
                    return (u.email || "").toLowerCase().indexOf(userSearch.toLowerCase()) !== -1;
                  })
                  .map(function (u) {
                    var isOwner = u.email === "aanour1985@gmail.com";
                    return (
                      <div key={u.id} style={Object.assign({}, cardStyle, { marginBottom: "10px" })}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", wordBreak: "break-word" }}>
                              {u.email}
                            </div>
                            {u.name && (
                              <div style={{ fontSize: "0.8rem", color: TH.textSec, marginTop: "2px" }}>
                                {u.name}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                              {isOwner && (
                                <span style={{ background: "rgba(91,108,240,0.1)", color: TH.primary, padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                  {rtl ? "\u0645\u0627\u0644\u0643" : "Owner"}
                                </span>
                              )}
                              {u.is_admin && !isOwner && (
                                <span style={{ background: "rgba(91,108,240,0.1)", color: TH.primary, padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                  {rtl ? "\u0623\u062f\u0645\u0646" : "Admin"}
                                </span>
                              )}
                              <span style={{ background: "rgba(0,0,0,0.05)", color: TH.textSec, padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600, textTransform: "capitalize" }}>
                                {u.plan || "free"}
                              </span>
                              <span style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                {"\ud83d\udcb0 " + (u.credits || 0)}
                              </span>
                              {u.is_banned && (
                                <span style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                  {rtl ? "\u0645\u062d\u0638\u0648\u0631" : "Banned"}
                                </span>
                              )}
                              {u.is_frozen && (
                                <span style={{ background: "rgba(14,165,233,0.1)", color: "#0EA5E9", padding: "3px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
                                  {rtl ? "\u0645\u062c\u0645\u062f" : "Frozen"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!isOwner && (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <button
                              onClick={function () { handleToggleBan(u.id, u.is_banned, u.email); }}
                              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                              style={Object.assign({}, btnBase, {
                                padding: "6px 12px", borderRadius: "8px",
                                border: "1px solid #EF4444",
                                background: u.is_banned ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.05)",
                                color: "#EF4444", fontSize: "0.75rem", fontWeight: 600,
                              })}
                            >{u.is_banned ? (rtl ? "\u0631\u0641\u0639 \u0627\u0644\u062d\u0638\u0631" : "Unban") : t("ban")}</button>
                            <button
                              onClick={function () { handleToggleFreeze(u.id, u.is_frozen, u.email); }}
                              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                              style={Object.assign({}, btnBase, {
                                padding: "6px 12px", borderRadius: "8px",
                                border: "1px solid #F59E0B",
                                background: u.is_frozen ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.05)",
                                color: "#F59E0B", fontSize: "0.75rem", fontWeight: 600,
                              })}
                            >{u.is_frozen ? (rtl ? "\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u062a\u062c\u0645\u064a\u062f" : "Unfreeze") : t("freeze")}</button>
                          </div>
                        )}
                        {/* V2.6 — Grant Credits */}
                        {!isOwner && (
                          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed " + TH.border }}>
                            <div style={{ fontSize: "0.7rem", color: TH.textSec, marginBottom: "6px", fontWeight: 600 }}>
                              {rtl ? "\u0625\u0636\u0627\u0641\u0629/\u0633\u062d\u0628 \u0643\u0631\u064a\u062f\u062a" : "Grant / Deduct Credits"}
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <input
                                type="number"
                                value={creditInputs[u.id] || ""}
                                onChange={function (e) {
                                  var val = e.target.value;
                                  setCreditInputs(function (prev) {
                                    var next = Object.assign({}, prev);
                                    next[u.id] = val;
                                    return next;
                                  });
                                }}
                                placeholder={rtl ? "\u0645\u062b\u0627\u0644: 50 \u0623\u0648 -10" : "e.g. 50 or -10"}
                                style={Object.assign({}, inputStyle, { flex: 1, marginBottom: 0, padding: "8px 10px", fontSize: "0.8rem" })}
                              />
                              <button
                                onClick={function () { handleGrantCredits(u.id, u.credits || 0); }}
                                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                                style={Object.assign({}, btnBase, {
                                  padding: "8px 14px", borderRadius: "8px",
                                  border: "none", background: GRD,
                                  color: "#fff", fontWeight: 700, fontSize: "0.8rem",
                                  whiteSpace: "nowrap",
                                })}
                              >{rtl ? "\u062a\u0637\u0628\u064a\u0642" : "Apply"}</button>
                            </div>
                          </div>
                        )}
                        {/* V2.6 — Change Plan */}
                        {!isOwner && (
                          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed " + TH.border }}>
                            <div style={{ fontSize: "0.7rem", color: TH.textSec, marginBottom: "6px", fontWeight: 600 }}>
                              {rtl ? "\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0628\u0627\u0642\u0629" : "Change Plan"}
                            </div>
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                              {PLANS.map(function (p) {
                                var active = (u.plan || "free") === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    onClick={function () { handleChangePlan(u.id, p.id, u.email); }}
                                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                                    style={Object.assign({}, btnBase, {
                                      padding: "6px 10px", borderRadius: "8px",
                                      border: "1px solid " + (active ? TH.primary : TH.border),
                                      background: active ? TH.primary : "transparent",
                                      color: active ? "#fff" : TH.text,
                                      fontSize: "0.72rem",
                                      fontWeight: active ? 700 : 500,
                                    })}
                                  >{p.name}</button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* #16 Messages */}

            {/* Admins tab - add/remove admins */}
            {adminTab === "admins" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <h3 style={{ fontWeight: 700 }}>
                    {rtl ? "\ud83d\udc51 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0634\u0631\u0641\u064a\u0646" : "\ud83d\udc51 Manage Admins"}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: TH.textSec }}>
                    {allAdmins.length + " " + (rtl ? "\u0645\u0634\u0631\u0641" : "admins")}
                  </span>
                </div>

                {loadingAdmins && (
                  <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
                    {rtl ? "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644..." : "Loading..."}
                  </p>
                )}

                {!loadingAdmins && allAdmins.map(function (a) {
                  var isOwner = a.email === "aanour1985@gmail.com";
                  return (
                    <div key={a.id} style={Object.assign({}, cardStyle, { marginBottom: "10px" })}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                          <div style={{ fontWeight: 600, wordBreak: "break-word" }}>
                            {a.name || a.email}
                          </div>
                          {a.name && (
                            <div style={{ fontSize: "0.75rem", color: TH.textSec, wordBreak: "break-word" }}>
                              {a.email}
                            </div>
                          )}
                          {isOwner && (
                            <div style={{ fontSize: "0.7rem", color: TH.primary, fontWeight: 700, marginTop: "4px" }}>
                              {rtl ? "\u0645\u0627\u0644\u0643 \u0627\u0644\u0645\u0646\u0635\u0629" : "Platform Owner"}
                            </div>
                          )}
                        </div>
                        {isOwner ? (
                          <span style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E", padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700 }}>
                            {rtl ? "\u0645\u0627\u0644\u0643" : "Owner"}
                          </span>
                        ) : (
                          <button
                            onClick={function () { handleRemoveAdmin(a.id, a.email); }}
                            onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                            style={Object.assign({}, btnBase, {
                              padding: "6px 12px", borderRadius: "8px",
                              border: "1px solid #EF4444", background: "rgba(239,68,68,0.05)",
                              color: "#EF4444", fontSize: "0.75rem", fontWeight: 600,
                            })}
                          >{rtl ? "\u0625\u0644\u063a\u0627\u0621" : "Remove"}</button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add admin form */}
                <div style={Object.assign({}, cardStyle, { marginTop: "16px" })}>
                  <h4 style={{ fontWeight: 600, marginBottom: "10px", fontSize: "0.9rem" }}>
                    {rtl ? "\u0625\u0636\u0627\u0641\u0629 \u0645\u0634\u0631\u0641 \u062c\u062f\u064a\u062f" : "Add New Admin"}
                  </h4>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <input
                      value={addAdminEmail}
                      onChange={function (e) { setAddAdminEmail(e.target.value); }}
                      placeholder={t("email")} type="email"
                      style={Object.assign({}, inputStyle, { flex: "1 1 200px", marginBottom: 0, minWidth: 0 })}
                    />
                    <button
                      onClick={handleAddAdmin}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        padding: "12px 20px", borderRadius: "10px",
                        border: "none", background: GRD,
                        color: "#fff", fontWeight: 700, whiteSpace: "nowrap",
                      })}
                    >{rtl ? "\u0625\u0636\u0627\u0641\u0629" : "Add"}</button>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: TH.textSec, marginTop: "8px" }}>
                    {rtl ? "\u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u0633\u062c\u0644\u0627\u064b \u0628\u0627\u0644\u0641\u0639\u0644" : "User must already be registered"}
                  </p>
                </div>
              </div>
            )}
            {adminTab === "messages" && (
              <div>
                {/* Header with count */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontWeight: 700 }}>{"\ud83d\udce9 " + t("messages")}</h3>
                  <span style={{ fontSize: "0.8rem", color: TH.textSec }}>
                    {adminMessages.length + " " + (rtl ? "\u0631\u0633\u0627\u0644\u0629" : "messages")}
                  </span>
                </div>

                {/* Filter chips */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                  {[
                    { id: "all", l: rtl ? "\u0627\u0644\u0643\u0644" : "All", c: "#3B82F6" },
                    { id: "new", l: rtl ? "\u062c\u062f\u064a\u062f" : "New", c: "#EF4444" },
                    { id: "read", l: rtl ? "\u0645\u0642\u0631\u0648\u0621" : "Read", c: "#F59E0B" },
                    { id: "replied", l: rtl ? "\u062a\u0645 \u0627\u0644\u0631\u062f" : "Replied", c: "#22C55E" },
                    { id: "appeals", l: rtl ? "\u0637\u0644\u0628\u0627\u062a \u0631\u0641\u0639 \u062d\u0638\u0631" : "Appeals", c: "#EF4444" },
                  ].map(function (f) {
                    var active = msgFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={function () { setMsgFilter(f.id); }}
                        onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                        style={Object.assign({}, btnBase, {
                          padding: "6px 14px", borderRadius: "16px",
                          border: "1px solid " + (active ? f.c : TH.border),
                          background: active ? f.c + "14" : "transparent",
                          color: active ? f.c : TH.textSec,
                          fontSize: "0.78rem", fontWeight: active ? 700 : 500,
                        })}
                      >{f.l}</button>
                    );
                  })}
                </div>

                {/* Loading */}
                {loadingMsgs && (
                  <div style={Object.assign({}, cardStyle, { textAlign: "center" })}>
                    <p style={{ color: TH.textSec }}>{"\u23f3 " + (rtl ? "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644..." : "Loading...")}</p>
                  </div>
                )}

                {/* Messages list (filtered) */}
                {!loadingMsgs && (function () {
                  var filtered = adminMessages.filter(function (m) {
                    if (msgFilter === "all") return true;
                    if (msgFilter === "appeals") return m.type === "ban_appeal";
                    var st = m.status || "new";
                    return st === msgFilter;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={Object.assign({}, cardStyle, { textAlign: "center" })}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{"\ud83d\udce9"}</div>
                        <p style={{ fontWeight: 600, marginBottom: "6px" }}>
                          {rtl ? "\u0644\u0627 \u0631\u0633\u0627\u0626\u0644" : "No messages"}
                        </p>
                        <p style={{ color: TH.textSec, fontSize: "0.85rem" }}>
                          {rtl ? "\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0647\u062a\u0638\u0647\u0631 \u0647\u0646\u0627" : "Contact form messages will appear here"}
                        </p>
                      </div>
                    );
                  }

                  return filtered.map(function (msg) {
                    var status = msg.status || "new";
                    var statusColor = status === "new" ? "#EF4444" : status === "read" ? "#F59E0B" : "#22C55E";
                    var statusLabel = status === "new"
                      ? (rtl ? "\u062c\u062f\u064a\u062f" : "New")
                      : status === "read"
                        ? (rtl ? "\u0645\u0642\u0631\u0648\u0621" : "Read")
                        : (rtl ? "\u062a\u0645 \u0627\u0644\u0631\u062f" : "Replied");
                    var isAppeal = msg.type === "ban_appeal";
                    var typeIcon = isAppeal ? "\ud83d\udea8"
                      : msg.type === "complaint" ? "\u26a0\ufe0f"
                      : msg.type === "question" ? "\u2753"
                      : msg.type === "bug" ? "\ud83d\udc1b"
                      : "\ud83d\udca1";
                    return (
                      <div
                        key={msg.id}
                        onClick={function () { if (status === "new") markMessageRead(msg.id); }}
                        style={Object.assign({}, cardStyle, {
                          marginBottom: "10px", cursor: "pointer",
                          opacity: status === "replied" ? 0.7 : 1,
                          border: isAppeal ? "2px solid #EF4444" : cardStyle.border,
                          background: isAppeal ? "rgba(239,68,68,0.03)" : cardStyle.background,
                        })}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{
                              background: isAppeal ? "#EF444420" : "#F59E0B20",
                              color: isAppeal ? "#EF4444" : "#F59E0B",
                              padding: "2px 8px", borderRadius: "6px",
                              fontSize: "0.65rem", fontWeight: 700,
                            }}>{typeIcon + " " + (isAppeal ? (rtl ? "\u0637\u0644\u0628 \u0631\u0641\u0639 \u062d\u0638\u0631" : "Ban Appeal") : (msg.type || "suggestion"))}</span>
                            <span style={{
                              background: statusColor + "20", color: statusColor,
                              padding: "2px 8px", borderRadius: "6px",
                              fontSize: "0.65rem", fontWeight: 700,
                            }}>{statusLabel}</span>
                          </div>
                          <span style={{ fontSize: "0.7rem", color: TH.textSec }}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>
                          {msg.subject || (rtl ? "\u0628\u062f\u0648\u0646 \u0639\u0646\u0648\u0627\u0646" : "No subject")}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: TH.textSec, marginBottom: "8px" }}>
                          {msg.email || ""}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: TH.text, marginBottom: "10px", whiteSpace: "pre-wrap" }}>
                          {msg.message || ""}
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            onClick={function (e) { e.stopPropagation(); replyToMessage(msg); }}
                            onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                            style={Object.assign({}, btnBase, {
                              padding: "4px 12px", borderRadius: "6px",
                              border: "1px solid " + TH.primary, background: TH.primary + "14",
                              color: TH.primary, fontSize: "0.75rem", fontWeight: 600,
                            })}
                          >{"\ud83d\udce7 " + (rtl ? "\u0631\u062f" : "Reply")}</button>
                          {status !== "replied" && (
                            <button
                              onClick={function (e) { e.stopPropagation(); markMessageReplied(msg.id); }}
                              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                              style={Object.assign({}, btnBase, {
                                padding: "4px 12px", borderRadius: "6px",
                                border: "1px solid #22C55E", background: "rgba(34,197,94,0.08)",
                                color: "#22C55E", fontSize: "0.75rem", fontWeight: 600,
                              })}
                            >{"\u2705 " + (rtl ? "\u062a\u0645 \u0627\u0644\u0631\u062f" : "Mark Replied")}</button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

        {/* ========== WRITERS #11 for all + rank ========== */}
        {view === "writers" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "760px", margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.4rem",
              fontWeight: 700, textAlign: "center", marginBottom: "8px",
            }}>{"\ud83d\udc65 " + t("writersDir")}</h1>
            <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.9rem", marginBottom: "20px" }}>
              {rtl ? "\u0627\u0643\u062a\u0634\u0641 \u0623\u0641\u0636\u0644 \u0643\u062a\u0627\u0628 \u0627\u0644\u0645\u0646\u0635\u0629" : "Discover the platform's top writers"}
            </p>

            <input
              value={writerSearch}
              onChange={function (e) { setWriterSearch(e.target.value); }}
              placeholder={t("search")}
              style={Object.assign({}, inputStyle, { marginBottom: "20px" })}
            />

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}>
              {DEMO_WRITERS.filter(function (w) {
                return !writerSearch || w.name.toLowerCase().indexOf(writerSearch.toLowerCase()) !== -1;
              }).map(function (w, i) {
                return (
                  <div
                    key={i}
                    onMouseEnter={onCardHoverIn} onMouseLeave={onCardHoverOut}
                    style={Object.assign({}, cardStyle, {
                      textAlign: "center", position: "relative",
                    })}
                  >
                    {/* Rank badge */}
                    {w.rank <= 3 && (
                      <div style={{
                        position: "absolute", top: "10px", right: "10px",
                        fontSize: "1.1rem",
                      }}>
                        {w.rank === 1 ? "\ud83e\udd47" : w.rank === 2 ? "\ud83e\udd48" : "\ud83e\udd49"}
                      </div>
                    )}

                    <div style={{
                      width: "56px", height: "56px", borderRadius: "50%",
                      background: GRD, display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 10px", fontSize: "1.3rem", fontWeight: 800, color: "#fff",
                    }}>{w.name.charAt(0)}</div>

                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{rtl ? w.nA : w.name}</div>
                    <div style={{ color: TH.primary, fontSize: "0.85rem", fontWeight: 600, marginTop: "2px" }}>
                      {rtl ? w.sA : w.spec}
                    </div>
                    <div style={{ color: TH.textSec, fontSize: "0.78rem", marginTop: "6px", lineHeight: 1.4 }}>
                      {rtl ? w.bio.ar : w.bio.en}
                    </div>
                    <div style={{ color: TH.textSec, fontSize: "0.8rem", marginTop: "8px" }}>
                      {"\ud83d\udcc4 " + w.arts + " \u2022 \u2b50 " + w.rate}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== PRICING #10 plan descriptions ========== */}
        {view === "pricing" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "860px", margin: "0 auto" }}>
            <h1 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.5rem",
              fontWeight: 700, textAlign: "center", marginBottom: "8px",
            }}>{"\ud83d\udc8e " + t("pricing")}</h1>
            <p style={{ textAlign: "center", color: TH.textSec, marginBottom: "32px" }}>
              {rtl ? "\u0627\u062e\u062a\u0631 \u0627\u0644\u062e\u0637\u0629 \u0627\u0644\u0644\u064a \u062a\u0646\u0627\u0633\u0628\u0643" : "Choose the plan that fits you"}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px", marginBottom: "48px",
            }}>
              {PLANS.map(function (plan, i) {
                return (
                  <div
                    key={i}
                    onMouseEnter={onCardHoverIn} onMouseLeave={onCardHoverOut}
                    style={Object.assign({}, cardStyle, {
                      textAlign: "center", position: "relative",
                      border: plan.pop ? "2px solid " + TH.primary : "1px solid " + TH.border,
                    })}
                  >
                    {plan.pop && (
                      <div style={{
                        position: "absolute", top: "-12px", left: "50%",
                        transform: "translateX(-50%)", background: GRD,
                        color: "#fff", padding: "4px 16px", borderRadius: "12px",
                        fontSize: "0.72rem", fontWeight: 700,
                      }}>{"\u2b50 " + t("popular")}</div>
                    )}

                    <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>{plan.name}</h3>
                    <p style={{ color: TH.textSec, fontSize: "0.8rem", marginBottom: "12px" }}>
                      {rtl ? plan.desc.ar : plan.desc.en}
                    </p>

                    <div style={{ fontSize: "2rem", fontWeight: 800, color: TH.primary }}>
                      {plan.price === 0 ? t("free") : "$" + plan.price}
                    </div>
                    {plan.price > 0 && (
                      <div style={{ color: TH.textSec, fontSize: "0.8rem", marginBottom: "16px" }}>
                        {"/" + t("month")}
                      </div>
                    )}

                    <div style={{ marginBottom: "18px" }}>
                      {(rtl ? plan.features.ar : plan.features.en).map(function (feat, j) {
                        return (
                          <div key={j} style={{ color: TH.textSec, fontSize: "0.8rem", padding: "4px 0" }}>
                            {"\u2713 " + feat}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={function () { showToast(t("comingSoon"), "info"); }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
                      style={Object.assign({}, btnBase, {
                        width: "100%", padding: "12px", borderRadius: "10px",
                        border: plan.pop ? "none" : "1px solid " + TH.border,
                        background: plan.pop ? GRD : "transparent",
                        color: plan.pop ? "#fff" : TH.text, fontWeight: 700,
                      })}
                    >{plan.price === 0 ? t("startFree") : t("subscribe")}</button>
                  </div>
                );
              })}
            </div>

            {/* Credit Packs */}
            <h2 style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem",
              fontWeight: 700, textAlign: "center", marginBottom: "20px",
            }}>{"\ud83e\ude99 " + t("creditPacks")}</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
            }}>
              {PACKS.map(function (pack, i) {
                return (
                  <div key={i} style={Object.assign({}, cardStyle, {
                    textAlign: "center", position: "relative",
                    border: pack.best ? "2px solid #F59E0B" : "1px solid " + TH.border,
                  })}>
                    {pack.best && (
                      <div style={{
                        position: "absolute", top: "-8px", right: "10px",
                        background: "#F59E0B", color: "#fff",
                        padding: "3px 10px", borderRadius: "8px",
                        fontSize: "0.65rem", fontWeight: 700,
                      }}>{t("bestValue")}</div>
                    )}
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>
                      {pack.cr + " \ud83e\ude99"}
                    </div>
                    <div style={{ color: TH.textSec, fontSize: "0.8rem", margin: "6px 0 14px" }}>
                      {rtl ? pack.labelAr : pack.label}
                    </div>
                    <button
                      onClick={function () { showToast(t("comingSoon"), "info"); }}
                      onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                      style={Object.assign({}, btnBase, {
                        width: "100%", padding: "10px", borderRadius: "8px",
                        border: "none", background: "#F59E0B",
                        color: "#fff", fontWeight: 700,
                      })}
                    >{"$" + pack.price}</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== CREDITS ========== */}
        {view === "credits" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "560px", margin: "0 auto" }}>
            <div style={{
              background: GRD, borderRadius: "20px",
              padding: "32px", textAlign: "center", color: "#fff", marginBottom: "24px",
            }}>
              <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>{t("balance")}</div>
              <div style={{ fontSize: "2.8rem", fontWeight: 800 }}>{displayCredits + " \ud83e\ude99"}</div>
              <button
                onClick={function () { navigate("pricing"); }}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                style={Object.assign({}, btnBase, {
                  marginTop: "16px", background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff", padding: "10px 28px", borderRadius: "10px", fontWeight: 700,
                })}
              >{t("buyCredits")}</button>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: "14px" }}>{t("toolCosts")}</h3>
              {TOOLS.map(function (tl, i) {
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i < TOOLS.length - 1 ? "1px solid " + TH.border : "none",
                  }}>
                    <span style={{ fontSize: "0.9rem" }}>{tl.icon + " " + (rtl ? tl.ar : tl.en)}</span>
                    <span style={{ color: TH.primary, fontWeight: 700, fontSize: "0.9rem" }}>
                      {tl.cost + " \ud83e\ude99"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== CONTACT ========== */}
        {view === "contact" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "560px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{"\ud83d\udce9"}</div>
              <h1 style={{
                fontFamily: "'Source Serif 4', serif", fontSize: "1.5rem", fontWeight: 700,
              }}>{t("contact")}</h1>
            </div>

            {/* Type selector */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "6px",
              justifyContent: "center", marginBottom: "24px",
            }}>
              {CONTACT_TYPES.map(function (ct) {
                return (
                  <button
                    key={ct.id}
                    onClick={function () { setContactType(ct.id); }}
                    onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                    style={Object.assign({}, chipStyle(contactType === ct.id), btnBase)}
                  >{ct.e + " " + (rtl ? ct.ar : ct.en)}</button>
                );
              })}
            </div>

            <input
              value={contactEmail || (user ? user.email : "")}
              onChange={function (e) { setContactEmail(e.target.value); }}
              placeholder={t("email")} style={inputStyle}
            />
            <input
              value={contactSubject}
              onChange={function (e) { setContactSubject(e.target.value); }}
              placeholder={t("subject")} style={inputStyle}
            />
            <textarea
              value={contactMsg}
              onChange={function (e) { setContactMsg(e.target.value); }}
              placeholder={t("message")} rows={5}
              style={Object.assign({}, inputStyle, { resize: "vertical", lineHeight: 1.7 })}
            />
            <button
              onClick={function () {
                if (!contactSubject || !contactMsg) { showToast(t("fillFields"), "error"); return; }
                if (safeDb) { try { safeDb.sendContactMessage(user ? user.id : null, contactType, contactSubject, contactMsg); } catch (e) {} }
                showToast(t("messageSent") + " \ud83d\udce9", "success");
                setContactSubject(""); setContactMsg("");
              }}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, btnBase, {
                width: "100%", padding: "16px", borderRadius: "14px",
                border: "none", background: GRD, color: "#fff",
                fontSize: "1.05rem", fontWeight: 700,
              })}
            >{"\ud83d\udce9 " + t("send")}</button>
          </div>
        )}

        {/* ========== TERMS ========== */}
        {view === "terms" && (
          <div style={{ padding: "24px 16px 40px", maxWidth: "660px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
              <button
                onClick={function () { setTermsTab("terms"); }}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                style={Object.assign({}, chipStyle(termsTab === "terms"), btnBase)}
              >{"\ud83d\udcdc " + t("terms")}</button>
              <button
                onClick={function () { setTermsTab("privacy"); }}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                style={Object.assign({}, chipStyle(termsTab === "privacy"), btnBase)}
              >{"\ud83d\udd12 " + t("privacy")}</button>
            </div>

            <div style={Object.assign({}, cardStyle, { lineHeight: 1.8, direction: rtl ? "rtl" : "ltr" })}>
              {termsTab === "terms" ? (
                <div>
                  <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "16px" }}>
                    {"\ud83d\udcdc " + t("termsTitle")}
                  </h2>
                  <p style={{ color: TH.textSec, marginBottom: "16px" }}>{t("termsIntro")}</p>
                  <h3 style={{ color: TH.primary, fontWeight: 700, marginTop: "20px" }}>{t("acceptableUse")}</h3>
                  <p style={{ color: TH.textSec }}>{t("acceptableUseDesc")}</p>
                  <h3 style={{ color: TH.primary, fontWeight: 700, marginTop: "20px" }}>{t("contentOwnership")}</h3>
                  <p style={{ color: TH.textSec }}>{t("contentOwnershipDesc")}</p>
                  <h3 style={{ color: TH.primary, fontWeight: 700, marginTop: "20px" }}>{t("creditsPolicy")}</h3>
                  <p style={{ color: TH.textSec }}>{t("creditsPolicyDesc")}</p>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "16px" }}>
                    {"\ud83d\udd12 " + t("privacyTitle")}
                  </h2>
                  <h3 style={{ color: TH.primary, fontWeight: 700 }}>{t("dataPolicy")}</h3>
                  <p style={{ color: TH.textSec }}>{t("dataPolicyDesc")}</p>
                  <h3 style={{ color: TH.primary, fontWeight: 700, marginTop: "20px" }}>{t("security")}</h3>
                  <p style={{ color: TH.textSec }}>{t("securityDesc")}</p>
                  <h3 style={{ color: TH.primary, fontWeight: 700, marginTop: "20px" }}>{t("yourRights")}</h3>
                  <p style={{ color: TH.textSec }}>{t("yourRightsDesc")}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ========== AUTH MODAL #4 password eye, Google login ========== */}
      {showAuth && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div
            onClick={function () { setShowAuth(false); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
          />
          <div style={{
            position: "relative", background: TH.card,
            borderRadius: "24px", padding: "36px 28px",
            width: "90%", maxWidth: "400px",
            border: "1px solid " + TH.border,
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
          }}>
            {/* Close */}
            <button
              onClick={function () { setShowAuth(false); }}
              style={{
                position: "absolute", top: "14px", right: "18px",
                background: "none", border: "none", fontSize: "1.4rem",
                cursor: "pointer", color: TH.textSec,
              }}
            >{"\u00d7"}</button>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{"\u270d\ufe0f"}</div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {authMode === "login" ? t("login") : t("signup")}
              </h2>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
              style={Object.assign({}, btnBase, {
                width: "100%", padding: "14px", borderRadius: "12px",
                border: "1px solid " + TH.border, background: TH.card,
                color: TH.text, fontSize: "0.95rem", fontWeight: 600,
                marginBottom: "20px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              })}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {t("googleLogin")}
            </button>

            {/* Divider */}
            <div style={{
              textAlign: "center", color: TH.textSec,
              fontSize: "0.8rem", marginBottom: "20px",
              position: "relative",
            }}>
              <span style={{
                background: TH.card, padding: "0 14px",
                position: "relative", zIndex: 1,
              }}>{t("or")}</span>
              <div style={{
                position: "absolute", top: "50%", left: 0, right: 0,
                height: "1px", background: TH.border, zIndex: 0,
              }} />
            </div>

            {/* Name (signup only) */}
            {authMode === "signup" && (
              <input
                value={authName}
                onChange={function (e) { setAuthName(e.target.value); }}
                placeholder={t("name")}
                style={inputStyle}
              />
            )}

            {/* Email */}
            <input
              value={authEmail}
              onChange={function (e) { setAuthEmail(e.target.value); }}
              placeholder={t("email")} type="email"
              style={inputStyle}
            />

            {/* #4 Password with eye toggle */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input
                value={authPass}
                onChange={function (e) { setAuthPass(e.target.value); }}
                placeholder={t("password")}
                type={showPw ? "text" : "password"}
                style={Object.assign({}, inputStyle, {
                  marginBottom: 0,
                  paddingRight: rtl ? "14px" : "52px",
                  paddingLeft: rtl ? "52px" : "14px",
                })}
              />
              <button
                onClick={function () { setShowPw(!showPw); }}
                style={{
                  position: "absolute", top: "50%",
                  right: rtl ? "auto" : "14px",
                  left: rtl ? "14px" : "auto",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: TH.textSec, fontSize: "1rem",
                  cursor: "pointer", padding: "4px",
                }}
              >{showPw ? "\ud83d\ude48" : "\ud83d\udc41"}</button>
            </div>

            {/* Submit */}
            <button
              onClick={authMode === "login" ? handleLogin : handleSignup}
              disabled={authLoading}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
              style={Object.assign({}, primaryBtn, {
                width: "100%", marginBottom: "14px",
                cursor: authLoading ? "wait" : "pointer",
                opacity: authLoading ? 0.7 : 1,
              })}
            >{authLoading ? "..." : (authMode === "login" ? t("login") : t("signup"))}</button>

            {/* Switch mode */}
            <p style={{ textAlign: "center", color: TH.textSec, fontSize: "0.85rem" }}>
              <span
                onClick={function () { setAuthMode(authMode === "login" ? "signup" : "login"); setShowPw(false); }}
                style={{ color: TH.primary, cursor: "pointer", fontWeight: 700 }}
              >{authMode === "login" ? t("signup") : t("login")}</span>
            </p>
          </div>
        </div>
      )}


      {/* ========== SHARE MODAL #9 with 5 methods ========== */}
      {/* FIX C: Article viewer modal — tap any article in My Articles to read */}
      {openArticle && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 250,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "20px 12px", overflowY: "auto",
        }}>
          <div
            onClick={function () { setOpenArticle(null); }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)" }}
          />
          <div style={{
            position: "relative", background: TH.card,
            borderRadius: "20px", padding: "24px 20px",
            width: "100%", maxWidth: "720px",
            border: "1px solid " + TH.border,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            marginTop: "20px", marginBottom: "40px",
            overflow: "hidden",
          }}>
            {/* Watermark for free users */}
            {hasWatermark && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: "none", zIndex: 1, overflow: "hidden",
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='120'><text x='50%' y='50%' font-family='Plus Jakarta Sans, sans-serif' font-size='32' font-weight='900' fill='" + (darkMode ? "rgb(155,123,240)" : "rgb(91,108,240)") + "' fill-opacity='" + (darkMode ? "0.18" : "0.17") + "' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 90 60)' letter-spacing='3'>OX</text></svg>\")",
                backgroundRepeat: "repeat",
                backgroundSize: "180px 120px",
              }} />
            )}

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "14px", position: "relative", zIndex: 2,
              paddingBottom: "12px", borderBottom: "1px solid " + TH.border,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>
                  {openArticle.title || openArticle.topic || (rtl ? "\u0645\u0642\u0627\u0644" : "Article")}
                </div>
                <div style={{ color: TH.textSec, fontSize: "0.78rem" }}>
                  {(openArticle.language || "") + " \u2022 " + (openArticle.mood ? ((MOOD_EMOJI[openArticle.mood] ? MOOD_EMOJI[openArticle.mood] + " " : "") + (rtl ? (MOOD_AR[openArticle.mood] || openArticle.mood) : openArticle.mood)) : "-") + " \u2022 " + (openArticle.word_count || "?") + " " + t("words")}
                </div>
              </div>
              <button
                onClick={function () { setOpenArticle(null); }}
                style={{
                  background: "none", border: "none", fontSize: "1.5rem",
                  cursor: "pointer", color: TH.textSec, padding: "4px 10px",
                  flexShrink: 0,
                }}
              >{"\u2715"}</button>
            </div>

            <div style={{
              lineHeight: 1.8, whiteSpace: "pre-wrap",
              direction: rtl ? "rtl" : "ltr",
              position: "relative", zIndex: 2,
              userSelect: canCopy ? "auto" : "none", WebkitUserSelect: canCopy ? "auto" : "none",
              fontSize: "0.95rem", maxHeight: "60vh", overflowY: "auto",
              paddingRight: "8px",
            }}>{openArticle.content || ""}</div>

            <div style={{
              display: "flex", gap: "8px", flexWrap: "wrap",
              marginTop: "16px", paddingTop: "12px",
              borderTop: "1px solid " + TH.border,
              position: "relative", zIndex: 2,
            }}>
              <button
                onClick={function () {
                  if (!requirePaid(
                    canCopy,
                    rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u062a\u062d\u0645\u064a\u0644" : "Upgrade to download",
                    function () { setOpenArticle(null); }
                  )) return;
                  var content = openArticle.content || "";
                  var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  var url = URL.createObjectURL(blob);
                  var a = document.createElement("a");
                  a.href = url; a.download = "oxquill-" + (openArticle.topic || "article").slice(0, 30) + ".txt";
                  document.body.appendChild(a); a.click();
                  document.body.removeChild(a); URL.revokeObjectURL(url);
                  showToast(rtl ? "\u062a\u0645!" : "Downloaded!", "success");
                }}
                style={Object.assign({}, btnBase, {
                  background: canCopy ? "rgba(245,158,11,0.12)" : "rgba(148,163,184,0.12)",
                  border: "1px solid " + (canCopy ? "#F59E0B" : "#94A3B8"),
                  color: canCopy ? "#F59E0B" : "#94A3B8",
                  padding: "8px 16px", borderRadius: "8px",
                  fontSize: "0.85rem", fontWeight: 600,
                })}
              >{"\ud83d\udcc4 " + (rtl ? "\u062a\u062d\u0645\u064a\u0644" : "Download") + (canCopy ? "" : " \ud83d\udd12")}</button>
              <button
                onClick={function () {
                  if (!requirePaid(
                    canCopy,
                    rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0646\u0633\u062e" : "Upgrade to copy",
                    function () { setOpenArticle(null); }
                  )) return;
                  try {
                    navigator.clipboard.writeText(openArticle.content || "");
                    showToast(t("copied"), "success");
                  } catch (e) {}
                }}
                style={Object.assign({}, btnBase, {
                  background: canCopy ? (TH.primary + "18") : "rgba(148,163,184,0.12)",
                  border: "1px solid " + (canCopy ? TH.primary : "#94A3B8"),
                  color: canCopy ? TH.primary : "#94A3B8",
                  padding: "8px 16px", borderRadius: "8px",
                  fontSize: "0.85rem", fontWeight: 600,
                })}
              >{"\ud83d\udccb " + t("copy") + (canCopy ? "" : " \ud83d\udd12")}</button>
              {/* V2.3 — Share button (matches Writer/Roast/Battle) */}
              <button
                onClick={function () {
                  if (!requirePaid(
                    canShare,
                    rtl ? "\u0631\u0642\u064a \u062e\u0637\u062a\u0643 \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629" : "Upgrade your plan to share",
                    function () { setOpenArticle(null); }
                  )) return;
                  /* Set result to article content so ShareModal works consistently */
                  setResult(openArticle.content || "");
                  setOpenArticle(null);
                  setShowShare(true);
                }}
                style={Object.assign({}, btnBase, {
                  background: canShare ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.12)",
                  border: "1px solid " + (canShare ? "#22C55E" : "#94A3B8"),
                  color: canShare ? "#22C55E" : "#94A3B8",
                  padding: "8px 16px", borderRadius: "8px",
                  fontSize: "0.85rem", fontWeight: 600,
                })}
              >{"\ud83d\udd17 " + t("share") + (canShare ? "" : " \ud83d\udd12")}</button>
            </div>
          </div>
        </div>
      )}

      {showShare && canShare && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div
            onClick={function () { setShowShare(false); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
          />
          <div style={{
            position: "relative", background: TH.card,
            borderRadius: "24px", padding: "32px 24px",
            width: "90%", maxWidth: "380px",
            border: "1px solid " + TH.border,
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
          }}>
            <button
              onClick={function () { setShowShare(false); }}
              style={{
                position: "absolute", top: "12px", right: "16px",
                background: "none", border: "none", fontSize: "1.3rem",
                cursor: "pointer", color: TH.textSec,
              }}
            >{"\u00d7"}</button>

            <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "1.2rem", fontWeight: 700 }}>
              {"\ud83d\udce4 " + t("shareTitle")}
            </h2>

            {[
              { ic: "\ud83d\udd17", key: "shareLink", action: function () {
                try { navigator.clipboard.writeText(window.location.href); showToast(t("linkCopied"), "success"); } catch (e) {}
              }},
              { ic: "\ud83d\udce7", key: "shareEmail", action: function () {
                var subj = encodeURIComponent(rtl ? "\u0634\u0648\u0641 \u0627\u0644\u0645\u0642\u0627\u0644 \u062f\u0647 \u0645\u0646 OxQuill" : "Check out this article from OxQuill");
                var body = encodeURIComponent(result.substring(0, 500) + "...\n\n" + window.location.href);
                window.open("mailto:?subject=" + subj + "&body=" + body);
              }},
              { ic: "\ud83c\udf10", key: "shareSocial", action: function () {
                var text = encodeURIComponent((rtl ? "\u0634\u0648\u0641 \u0627\u0644\u0645\u0642\u0627\u0644 \u062f\u0647 \u0645\u0646 OxQuill! " : "Check out this article from OxQuill! ") + window.location.href);
                window.open("https://twitter.com/intent/tweet?text=" + text);
              }},
              { ic: "\ud83d\udcc4", key: "sharePDF", action: function () {
                try {
                  var txt = result;
                  var blob = new Blob([txt + "\n\n---\nGenerated by OxQuill.com"], { type: "text/plain;charset=utf-8" });
                  var url = URL.createObjectURL(blob);
                  var a = document.createElement("a");
                  a.href = url; a.download = "oxquill-article.txt";
                  document.body.appendChild(a); a.click();
                  document.body.removeChild(a); URL.revokeObjectURL(url);
                  showToast(rtl ? "\u062a\u0645 \u0627\u0644\u062a\u062d\u0645\u064a\u0644!" : "Downloaded!", "success");
                } catch (e) { showToast(rtl ? "\u0641\u064a\u0647 \u0645\u0634\u0643\u0644\u0629" : "Error", "error"); }
              }},
              { ic: "\u270d\ufe0f", key: "shareInternal", action: function () {
                try {
                  navigator.clipboard.writeText(result.substring(0, 280) + "...\n\nRead more on OxQuill.com");
                  showToast(rtl ? "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!" : "Copied for sharing!", "success");
                } catch (e) {}
              }},
            ].map(function (opt, i) {
              return (
                <button
                  key={i}
                  onClick={function () { opt.action(); setShowShare(false); }}
                  onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                  style={Object.assign({}, btnBase, {
                    width: "100%", padding: "14px 16px",
                    borderRadius: "12px", border: "1px solid " + TH.border,
                    background: TH.card, color: TH.text,
                    fontSize: "0.95rem", fontWeight: 600,
                    marginBottom: "8px", textAlign: rtl ? "right" : "left",
                    display: "flex", alignItems: "center", gap: "12px",
                  })}
                >
                  <span style={{ fontSize: "1.2rem" }}>{opt.ic}</span>
                  {t(opt.key)}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* V2.9 — Floating Invite Button (logged-in users only) */}
      {user && (
        <button
          onClick={function () { setShowInvite(true); }}
          onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
          aria-label={rtl ? "\u0627\u062f\u0639\u064a \u0623\u0635\u062d\u0627\u0628\u0643" : "Invite friends"}
          style={{
            position: "fixed", bottom: "90px",
            right: rtl ? undefined : "20px", left: rtl ? "20px" : undefined,
            width: "56px", height: "56px", borderRadius: "50%",
            background: GRD, border: "none", color: "#fff",
            fontSize: "1.6rem", cursor: "pointer", zIndex: 90,
            boxShadow: "0 6px 20px rgba(91,108,240,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >{"\ud83c\udf81"}</button>
      )}

      {/* V2.9 — Invite Modal */}
      {showInvite && (
        <div
          onClick={function () { setShowInvite(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", zIndex: 310,
          }}
        >
          <div
            onClick={function (e) { e.stopPropagation(); }}
            style={{
              background: TH.card, borderRadius: "20px",
              padding: "24px", maxWidth: "460px", width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              direction: rtl ? "rtl" : "ltr",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
                {"\ud83c\udf81 " + (rtl ? "\u0627\u062f\u0639\u064a \u0623\u0635\u062d\u0627\u0628\u0643" : "Invite your friends")}
              </h3>
              <button
                onClick={function () { setShowInvite(false); }}
                style={{ background: "none", border: "none", fontSize: "1.5rem", color: TH.textSec, cursor: "pointer", lineHeight: 1 }}
                aria-label="Close"
              >{"\u00d7"}</button>
            </div>

            {/* Tagline */}
            <p style={{ color: TH.textSec, fontSize: "0.85rem", marginBottom: "16px", lineHeight: 1.5 }}>
              {rtl
                ? "\u0634\u0627\u0631\u0643 OxQuill \u0645\u0639 \u0623\u0635\u062d\u0627\u0628\u0643 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0623\u0648 \u0623\u064a \u0628\u0631\u0646\u0627\u0645\u062c"
                : "Share OxQuill with your friends via WhatsApp or any app"}
            </p>

            {/* Message preview */}
            <div style={{
              background: darkMode ? "rgba(91,108,240,0.08)" : "rgba(91,108,240,0.04)",
              border: "1px solid " + TH.border, borderRadius: "14px",
              padding: "16px", marginBottom: "20px",
              fontSize: "0.88rem", lineHeight: 1.7,
              whiteSpace: "pre-wrap", color: TH.text,
              maxHeight: "260px", overflowY: "auto",
            }}>
              {getInviteMessage()}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handleInviteShare}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
                style={Object.assign({}, btnBase, {
                  flex: 1, minWidth: "120px",
                  background: GRD, color: "#fff", border: "none",
                  padding: "12px 18px", borderRadius: "12px",
                  fontSize: "0.9rem", fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(91,108,240,0.3)",
                })}
              >{"\ud83d\udce4 " + (rtl ? "\u0645\u0634\u0627\u0631\u0643\u0629" : "Share")}</button>
              <button
                onClick={handleInviteCopy}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} onMouseDown={onPress}
                style={Object.assign({}, btnBase, {
                  flex: 1, minWidth: "120px",
                  background: "transparent", color: TH.primary,
                  border: "2px solid " + TH.primary,
                  padding: "12px 18px", borderRadius: "12px",
                  fontSize: "0.9rem", fontWeight: 700,
                })}
              >{"\ud83d\udccb " + (rtl ? "\u0646\u0633\u062e" : "Copy")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== TOAST ========== */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "28px", left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "error" ? "#EF4444" : toast.type === "success" ? "#22C55E" : "#3B82F6",
          color: "#fff", padding: "14px 28px", borderRadius: "14px",
          fontSize: "0.9rem", fontWeight: 600, zIndex: 300,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          maxWidth: "90%",
        }}>{toast.msg}</div>
      )}

      {/* ========== FOOTER #18 redesign ========== */}
      <footer style={{
        borderTop: "1px solid " + TH.border,
        padding: "32px 16px", background: TH.card,
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Nav links */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "24px", marginBottom: "20px", flexWrap: "wrap",
          }}>
            {[
              { id: "landing", ic: "\ud83c\udfe0", key: "home" },
              { id: "pricing", ic: "\ud83d\udc8e", key: "pricing" },
              { id: "contact", ic: "\ud83d\udce9", key: "contact" },
              { id: "terms", ic: "\ud83d\udcdc", key: "terms" },
            ].map(function (link) {
              return (
                <span
                  key={link.id}
                  onClick={function () { navigate(link.id); }}
                  style={{
                    color: TH.textSec, fontSize: "0.85rem",
                    cursor: "pointer", transition: "color 0.2s",
                  }}
                  onMouseEnter={function (e) { e.currentTarget.style.color = TH.primary; }}
                  onMouseLeave={function (e) { e.currentTarget.style.color = TH.textSec; }}
                >{link.ic + " " + t(link.key)}</span>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "16px", marginBottom: "16px", alignItems: "center",
          }}>
            {/* Sun/Moon toggle */}
            <button
              onClick={function () { setDarkMode(!darkMode); }}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
              style={Object.assign({}, btnBase, {
                background: TH.border, border: "none",
                width: "40px", height: "40px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
              })}
            >{darkMode ? "\u2600\ufe0f" : "\ud83c\udf19"}</button>

            {/* Language toggle with flags */}
            <button
              onClick={function () { setRtl(!rtl); }}
              onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
              style={Object.assign({}, btnBase, {
                background: TH.border, border: "none",
                padding: "8px 18px", borderRadius: "20px",
                fontSize: "0.82rem", fontWeight: 700, color: TH.text,
              })}
            >{rtl ? "EN \ud83c\uddec\ud83c\udde7" : "AR \ud83c\uddf8\ud83c\udde6"}</button>
          </div>

          {/* Copyright */}
          <p style={{ color: TH.textSec, fontSize: "0.78rem", textAlign: "center" }}>
            {"\u00a9 2024 OxQuill. " + t("allRights")}
          </p>
        </div>
      </footer>

      {/* V2.5 — Ban Appeal Modal */}
      {banModalOpen && user && user.isBanned && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: TH.surface, borderRadius: "20px",
            padding: "28px", maxWidth: "500px", width: "100%",
            border: "2px solid #EF4444",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            direction: rtl ? "rtl" : "ltr",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "8px" }}>{"\ud83d\udeab"}</div>
              <h2 style={{ fontWeight: 800, color: "#EF4444", fontSize: "1.4rem", marginBottom: "6px" }}>
                {rtl ? "\u062d\u0633\u0627\u0628\u0643 \u0645\u062d\u0638\u0648\u0631" : "Account Suspended"}
              </h2>
              <p style={{ color: TH.textSec, fontSize: "0.9rem" }}>
                {rtl
                  ? "\u062a\u0645 \u062d\u0638\u0631 \u062d\u0633\u0627\u0628\u0643 \u0645\u0624\u0642\u062a\u0627\u064b. \u064a\u0645\u0643\u0646\u0643 \u0637\u0644\u0628 \u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0642\u0631\u0627\u0631 \u0628\u0625\u0631\u0633\u0627\u0644 \u0633\u0628\u0628 \u0627\u0633\u062a\u0626\u0646\u0627\u0641."
                  : "Your account has been suspended. You can request a review by submitting your appeal reason below."}
              </p>
            </div>

            <textarea
              value={banAppealText}
              onChange={function (e) { setBanAppealText(e.target.value); }}
              placeholder={rtl ? "\u0627\u0643\u062a\u0628 \u0633\u0628\u0628 \u0637\u0644\u0628 \u0631\u0641\u0639 \u0627\u0644\u062d\u0638\u0631..." : "Write your reason for appeal..."}
              rows={5}
              style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                border: "1px solid " + TH.border, background: TH.bg,
                color: TH.text, fontSize: "0.9rem", fontFamily: "inherit",
                resize: "vertical", marginBottom: "14px",
              }}
            />

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={handleSubmitAppeal}
                disabled={submittingAppeal}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                style={Object.assign({}, btnBase, {
                  flex: 1, padding: "12px", borderRadius: "10px",
                  border: "none", background: GRD, color: "#fff",
                  fontWeight: 700, minWidth: "140px",
                  opacity: submittingAppeal ? 0.6 : 1,
                })}
              >
                {submittingAppeal
                  ? (rtl ? "\u062c\u0627\u0631\u064d \u0627\u0644\u0625\u0631\u0633\u0627\u0644..." : "Sending...")
                  : (rtl ? "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628" : "Send Appeal")}
              </button>
              <button
                onClick={async function () {
                  try { if (safeDb && safeDb.signOut) await safeDb.signOut(); } catch (e) {}
                  setBanModalOpen(false);
                  setUser(null);
                  setView("landing");
                }}
                onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}
                style={Object.assign({}, btnBase, {
                  padding: "12px 20px", borderRadius: "10px",
                  border: "1px solid " + TH.border, background: "transparent",
                  color: TH.text, fontWeight: 600,
                })}
              >{rtl ? "\u062e\u0631\u0648\u062c" : "Logout"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
