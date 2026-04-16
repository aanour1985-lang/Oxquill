// ═══════════════════════════════════════════════════════════════════
// SUPABASE CLIENT — Singleton pattern for browser
// ═══════════════════════════════════════════════════════════════════
import { createClient } from "@supabase/supabase-js";

var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[Supabase] Missing environment variables");
}

// Singleton instance — reused across the app
export var supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce"
  }
});
