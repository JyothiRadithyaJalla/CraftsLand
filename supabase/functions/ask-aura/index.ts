// Supabase Edge Function: ask-aura
// Real AI Dining Concierge backend for AURA Customer Website
import { corsHeaders } from "../_shared/cors.ts";

declare const Deno: any;

// In-memory sliding window rate limiter (max 20 requests per minute per client)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 20;

  const record = rateLimitMap.get(clientId);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

interface LeanDish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  dietaryTags: string[];
  allergens: string[];
  calories?: number;
  isSignature: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
}

interface RequestPayload {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  menu: LeanDish[];
}

const SYSTEM_PROMPT = `You are "ASK AURA", the intelligent dining concierge for Aura — a fine-dining luxury restaurant.
Your tone is refined, editorial, warm, intelligent, minimal, and premium.
You represent culinary excellence. Never speak like a generic chatbot or support ticket agent.

STRICT OPERATIONAL & SECURITY RULES:
1. Grounding: You are STRICTLY grounded in the provided restaurant menu data.
   - ONLY recommend dishes that exist in the provided menu JSON.
   - NEVER invent, hallucinate, or assume dishes, prices, calories, ingredients, or allergens.
   - Use the exact dish IDs provided in the menu for recommended dishes.
2. Popularity Rule:
   - If the guest asks about popularity, most popular dishes, or best-sellers:
     State clearly: "I can recommend signature dishes, but I don't have verified popularity data."
     Then recommend chef's signature dishes from the menu.
     NEVER fabricate popularity or claim dish rankings that do not exist.
3. 3-Course Dinner Rule:
   - If asked for a 3-course dinner, select exactly one Starter, one Main Course, and one Dessert from the real menu.
   - Do NOT call this a "pairing" based on wine/sommelier logic.
   - Do NOT mention wine, cellar, or glass pairings.
4. Serving Size & Ambiguity:
   - If the guest asks about serving size (e.g. "what is good for two people?"):
     Explain from actual menu items (e.g. stone-baked pizzas and pasta platters designed to share), and explicitly state that serving sizes are not formally specified in the menu specifications rather than inventing portions.
5. Dietary & Safety:
   - Always strictly honor vegetarian, vegan, gluten-free, dairy, nut, and spice requirements using the provided metadata.
6. Scope of Authority:
   - You are a dining recommendation and culinary guidance concierge ONLY.
   - You CANNOT modify orders, process payments, book tables, alter prices, or access customer account data.

OUTPUT FORMAT:
Respond with a valid JSON object ONLY. No markdown wrapping around the JSON, or wrap in \`\`\`json ... \`\`\`.
Schema:
{
  "message": "Your refined, warm, editorial response text to the guest.",
  "recommendedDishIds": ["id-1", "id-2"]
}
Limit recommendedDishIds to at most 4 relevant dishes.`;

Deno.serve(async (req: Request) => {
  // 1. CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Client identification & Rate Limiting
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anonymous";
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many concierge requests. Please pause for a moment.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Request validation
    const body: RequestPayload = await req.json().catch(() => null);
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return new Response(
        JSON.stringify({ error: "BAD_REQUEST", message: "A valid message string is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userMessage = body.message.trim();
    if (userMessage.length > 500) {
      return new Response(
        JSON.stringify({ error: "PAYLOAD_TOO_LARGE", message: "Message exceeds 500 characters limit." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const menu = Array.isArray(body.menu) ? body.menu.slice(0, 50) : [];
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    // 4. Provider Resolution (Secure server-side env vars only)
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!geminiKey && !openaiKey && !anthropicKey) {
      return new Response(
        JSON.stringify({
          error: "AI_PROVIDER_KEY_REQUIRED",
          message: "AI provider / API key not configured on server. Required: GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Grounded Prompt Assembly
    const userPrompt = `LIVE AURA MENU DATA:
${JSON.stringify(menu, null, 2)}

CONVERSATION HISTORY:
${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n")}

GUEST INQUIRY:
${userMessage}

Provide your response in JSON format.`;

    let rawOutput = "";
    let providerName = "";

    // 6. Provider Execution with 15s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (geminiKey) {
        providerName = "gemini";
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          throw new Error(`Gemini API error (${geminiRes.status}): ${errText}`);
        }

        const data = await geminiRes.json();
        rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else if (openaiKey) {
        providerName = "openai";
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...history.map((h) => ({
                role: h.role === "assistant" ? "assistant" : "user",
                content: h.content,
              })),
              { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 600,
          }),
        });

        if (!openaiRes.ok) {
          const errText = await openaiRes.text();
          throw new Error(`OpenAI API error (${openaiRes.status}): ${errText}`);
        }

        const data = await openaiRes.json();
        rawOutput = data.choices?.[0]?.message?.content || "";
      } else if (anthropicKey) {
        providerName = "anthropic";
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: "claude-3-5-haiku-latest",
            system: SYSTEM_PROMPT,
            messages: [
              ...history.map((h) => ({
                role: h.role === "assistant" ? "assistant" : "user",
                content: h.content,
              })),
              { role: "user", content: userPrompt },
            ],
            max_tokens: 600,
            temperature: 0.3,
          }),
        });

        if (!anthropicRes.ok) {
          const errText = await anthropicRes.text();
          throw new Error(`Anthropic API error (${anthropicRes.status}): ${errText}`);
        }

        const data = await anthropicRes.json();
        rawOutput = data.content?.[0]?.text || "";
      }
    } finally {
      clearTimeout(timeoutId);
    }

    // 7. Parse & validate AI output
    let parsed: { message?: string; recommendedDishIds?: string[] } = {};
    try {
      const sanitized = rawOutput.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
      parsed = JSON.parse(sanitized);
    } catch {
      parsed = { message: rawOutput.trim(), recommendedDishIds: [] };
    }

    const validDishIds = new Set(menu.map((d) => d.id));
    const safeDishIds = Array.isArray(parsed.recommendedDishIds)
      ? parsed.recommendedDishIds.filter((id) => validDishIds.has(id))
      : [];

    return new Response(
      JSON.stringify({
        message: parsed.message || "Here are our chef's recommended selections from the menu:",
        recommendedDishIds: safeDishIds,
        provider: providerName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "AI_PROCESSING_ERROR",
        message: "AURA is taking a moment. Here are some menu options I can recommend right now.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
