import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    var body = req.body;
    var prompt = body.prompt;
    var userId = body.userId || null;
    var tool = body.tool || "unknown";

    var key = process.env.ANTHROPIC_API_KEY || process.env.Anthropic_Api_Key;
    if (!key) {
      return res.status(500).json({ error: "No API key" });
    }

    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    var data = await response.json();

    /* V3.1 — Track API usage in DB */
    if (data && data.usage && data.usage.input_tokens != null) {
      try {
        var supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        var supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY
          || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supaUrl && supaKey) {
          var supa = createClient(supaUrl, supaKey, {
            auth: { persistSession: false, autoRefreshToken: false }
          });

          var settingsRes = await supa
            .from("api_settings")
            .select("input_price_per_1m, output_price_per_1m")
            .eq("id", 1)
            .maybeSingle();

          var inputPrice = 3.00;
          var outputPrice = 15.00;
          if (settingsRes && settingsRes.data) {
            inputPrice = Number(settingsRes.data.input_price_per_1m) || 3.00;
            outputPrice = Number(settingsRes.data.output_price_per_1m) || 15.00;
          }

          var inputTokens = data.usage.input_tokens || 0;
          var outputTokens = data.usage.output_tokens || 0;
          var cost = (inputTokens / 1000000) * inputPrice
                   + (outputTokens / 1000000) * outputPrice;

          await supa.from("api_usage").insert([{
            user_id: userId,
            tool: tool,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            cost_usd: Number(cost.toFixed(6))
          }]);

          var balRes = await supa
            .from("api_settings")
            .select("balance_usd")
            .eq("id", 1)
            .maybeSingle();
          if (balRes && balRes.data) {
            var newBalance = Number(balRes.data.balance_usd) - cost;
            await supa
              .from("api_settings")
              .update({
                balance_usd: Number(newBalance.toFixed(2)),
                updated_at: new Date().toISOString()
              })
              .eq("id", 1);
          }
        }
      } catch (trackErr) {
        console.error("API usage tracking failed:", trackErr && trackErr.message);
      }
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
