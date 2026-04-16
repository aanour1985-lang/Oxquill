// ═══════════════════════════════════════════════════════════════════
// OAUTH CALLBACK ROUTE — Receives Google redirect after login
// ═══════════════════════════════════════════════════════════════════
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request) {
  var url = new URL(request.url);
  var code = url.searchParams.get("code");
  var origin = url.origin;
  var next = url.searchParams.get("next") || "/";

  // No code in URL — something went wrong with OAuth
  if (!code) {
    return NextResponse.redirect(origin + "/?error=no_code");
  }

  try {
    // Exchange the authorization code for a session
    var supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    var result = await supabase.auth.exchangeCodeForSession(code);

    if (result.error) {
      console.error("[Auth Callback] Exchange failed:", result.error.message);
      return NextResponse.redirect(origin + "/?error=exchange_failed");
    }

    // Successful authentication — redirect to the app
    return NextResponse.redirect(origin + next);
  } catch (err) {
    console.error("[Auth Callback] Unexpected error:", err);
    return NextResponse.redirect(origin + "/?error=unexpected");
  }
}
