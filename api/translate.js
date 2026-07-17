// Vercel serverless function: /api/translate
// 1. Validates the buyer's license key (Lemon Squeezy) unless SKIP_LICENSE_CHECK=true
// 2. Calls the Anthropic API with YOUR key (env var ANTHROPIC_API_KEY)
// Uses Haiku: ~$0.001 per lookup.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const word = (req.body?.word || "").toString().trim().slice(0, 80);
  const licenseKey = (req.body?.licenseKey || "").toString().trim();
  if (!word) return res.status(400).json({ error: "missing word" });

  // ── License check ──
  if (process.env.SKIP_LICENSE_CHECK !== "true") {
    if (!licenseKey)
      return res.status(403).json({ error: "Pro license required" });
    try {
      const lsRes = await fetch(
        "https://api.lemonsqueezy.com/v1/licenses/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: new URLSearchParams({ license_key: licenseKey }),
        }
      );
      const ls = await lsRes.json();
      if (!ls.valid)
        return res.status(403).json({ error: "Invalid or expired license key" });
    } catch {
      return res.status(502).json({ error: "License check failed, try again" });
    }
  }

  // ── Translation ──
  const prompt = `You are a translation engine inside an Italian-learning app. The learner is a native Spanish speaker who also speaks English.

Input word or short phrase: "${word}"

The input is usually Italian, but may be Spanish or English — detect the language. Translate so all three languages are filled in.

Respond ONLY with a raw JSON object, no markdown fences, with exactly these keys:
{"detected":"italian|spanish|english","italian":"...","spanish":"...","english":"...","partOfSpeech":"...","gender":"m. or f. for Italian nouns else empty","pronunciation":"simple phonetic guide","exampleIt":"one short Italian example sentence","exampleEs":"same sentence in Spanish","exampleEn":"same sentence in English","note":"false-friend warning with Spanish if applicable, or helpful cognate note, or empty"}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (data.type === "error" || data.error)
      return res.status(502).json({ error: data?.error?.message || "upstream error" });

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(502).json({ error: "no JSON in reply" });
    return res.status(200).json(JSON.parse(match[0]));
  } catch (e) {
    return res.status(500).json({ error: e.message || "server failure" });
  }
}
