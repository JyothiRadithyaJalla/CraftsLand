// Supabase Edge Function: create-cloudinary-signature
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

declare const Deno: any;

async function computeSha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const cloudinaryCloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const cloudinaryApiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const cloudinaryApiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Supabase server configuration missing." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Authenticate caller and verify Admin privileges
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired authorization token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Role check from profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile || (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Executive Admin privileges required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check Cloudinary environment configuration
    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      return new Response(
        JSON.stringify({
          error: "Cloudinary credentials not configured on server",
          code: "CLOUDINARY_NOT_CONFIGURED",
          details: "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Supabase secrets.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || "sign_upload";

    // Action A: Safely destroy/delete an old Cloudinary asset
    if (action === "destroy_asset") {
      const publicId = body.public_id;
      if (!publicId) {
        return new Response(
          JSON.stringify({ error: "public_id is required to destroy asset" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryApiSecret}`;
      const signature = await computeSha1(stringToSign);

      const formData = new URLSearchParams();
      formData.append("public_id", publicId);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", cloudinaryApiKey);
      formData.append("signature", signature);

      const destroyRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/video/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      const destroyData = await destroyRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ success: destroyRes.ok, result: destroyData }),
        { status: destroyRes.ok ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action B: Generate cryptographic signature for direct upload
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = body.folder || "craftsland/dishes";
    const publicId = body.public_id || undefined;
    const eager = body.eager || undefined;

    // Filter and sort parameters
    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
    };
    if (publicId) paramsToSign.public_id = publicId;
    if (eager) paramsToSign.eager = eager;

    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&") + cloudinaryApiSecret;
    const signature = await computeSha1(stringToSign);

    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        apiKey: cloudinaryApiKey,
        cloudName: cloudinaryCloudName,
        folder,
        publicId: publicId || null,
        eager: eager || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
