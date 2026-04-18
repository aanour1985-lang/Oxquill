// ═══════════════════════════════════════════════════════════════════
// DATABASE OPERATIONS — All Supabase queries in one place
// V3.2 — saveArticle + useCredits + addCredits + sendContactMessage
//        now throw on error so callers' try/catch blocks surface them
// ═══════════════════════════════════════════════════════════════════
"use client";
import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────

export async function signUp(email, password, name, gender) {
  var result = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name || email.split("@")[0],
        gender: gender || "neutral"
      },
      emailRedirectTo: typeof window !== "undefined"
        ? window.location.origin + "/auth/callback"
        : undefined
    }
  });
  return result;
}

export async function signIn(email, password) {
  var result = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  return result;
}

export async function signInWithGoogle() {
  var redirectUrl = typeof window !== "undefined"
    ? window.location.origin + "/auth/callback"
    : undefined;
  var result = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });
  return result;
}

export async function signOut() {
  var result = await supabase.auth.signOut();
  return result;
}

export async function resetPassword(email) {
  var redirectUrl = typeof window !== "undefined"
    ? window.location.origin + "/auth/callback"
    : undefined;
  var result = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
  });
  return result;
}

export async function getSession() {
  var result = await supabase.auth.getSession();
  return result.data.session;
}

export async function getCurrentUser() {
  var session = await getSession();
  return session ? session.user : null;
}

// ─────────────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────────────

export async function getProfile(userId) {
  var result = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return result;
}

export async function updateProfile(userId, updates) {
  var result = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  return result;
}

export async function deleteAccount(userId) {
  // RLS + cascade deletes will clean everything else
  var result = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  await signOut();
  return result;
}

// ─────────────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────────────

/**
 * V3.2 — getArticles returns an array directly (not a wrapper object)
 * and throws on DB errors. Previous version returned { data, error }
 * which broke callers that did `Array.isArray(result)`.
 */
export async function getArticles(userId) {
  if (!userId) return [];
  var result = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (result.error) {
    throw new Error(result.error.message || "getArticles DB query failed");
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * V3.2 — saveArticle accepts an object AND throws on DB errors.
 * This replaces the previous silent-failure behavior.
 */
export async function saveArticle(userId, article) {
  if (!userId) throw new Error("saveArticle: userId is required");
  if (!article || typeof article !== "object") {
    throw new Error("saveArticle: article must be an object");
  }
  if (!article.topic || !article.content) {
    throw new Error("saveArticle: article.topic and article.content are required");
  }

  var result = await supabase
    .from("articles")
    .insert({
      user_id: userId,
      topic: article.topic,
      content: article.content,
      language: article.language || null,
      tone: article.tone || null,
      mood: article.mood || null,
      era: article.era || null,
      template: article.template || null,
      words: article.words || 0
    })
    .select()
    .single();

  if (result.error) {
    throw new Error(result.error.message || "DB insert failed");
  }
  return result;
}

export async function deleteArticle(articleId) {
  var result = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);
  return result;
}

export async function toggleFavorite(articleId, currentValue) {
  var result = await supabase
    .from("articles")
    .update({ is_favorite: !currentValue })
    .eq("id", articleId);
  return result;
}

// ─────────────────────────────────────────────────────
// CREDITS
// ─────────────────────────────────────────────────────

export async function useCredits(userId, amount, action) {
  // Get current credits
  var profileResult = await getProfile(userId);
  if (profileResult.error) return { error: profileResult.error };

  var currentCredits = profileResult.data.credits;
  if (currentCredits < amount) {
    return { error: { message: "Insufficient credits" } };
  }

  var newBalance = currentCredits - amount;

  // Update profile
  var updateResult = await updateProfile(userId, { credits: newBalance });
  if (updateResult.error) return { error: updateResult.error };

  // Log transaction
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    amount: -amount,
    action: action,
    balance_after: newBalance
  });

  return { data: { newBalance: newBalance } };
}

export async function addCredits(userId, amount, reason) {
  var profileResult = await getProfile(userId);
  if (profileResult.error) return { error: profileResult.error };

  var newBalance = profileResult.data.credits + amount;
  var updateResult = await updateProfile(userId, { credits: newBalance });

  if (!updateResult.error) {
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: amount,
      action: reason || "credit_purchase",
      balance_after: newBalance
    });
  }
  return updateResult;
}

// ─────────────────────────────────────────────────────
// XP / GAMIFICATION
// ─────────────────────────────────────────────────────

export async function addXp(userId, amount) {
  var profileResult = await getProfile(userId);
  if (profileResult.error) return;
  var newXp = (profileResult.data.xp || 0) + amount;
  var newStreak = (profileResult.data.streak || 0) + 1;
  return await updateProfile(userId, { xp: newXp, streak: newStreak });
}

// ─────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────

export async function sendContactMessage(userId, type, subject, message) {
  var result = await supabase
    .from("contact_messages")
    .insert({
      user_id: userId || null,
      type: type,
      subject: subject,
      message: message
    });
  return result;
}

// ─────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────

export async function getAllUsers() {
  var result = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return result;
}

export async function blockUser(userId, block) {
  var result = await supabase
    .from("profiles")
    .update({ blocked: block })
    .eq("id", userId);
  return result;
}

export async function makeAdmin(email, makeAdminFlag) {
  var result = await supabase
    .from("profiles")
    .update({ is_admin: makeAdminFlag })
    .eq("email", email);
  return result;
}

export async function getContactMessages() {
  var result = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return result;
}
