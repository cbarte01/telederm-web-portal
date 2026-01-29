import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PricingData {
  standard_price: number;
  urgent_price: number;
}

const DEFAULT_PRICING: PricingData = {
  standard_price: 49,
  urgent_price: 74,
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Fetching current group pricing...");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "group_pricing")
      .maybeSingle();

    if (error) {
      console.error("Error fetching pricing:", error);
      return new Response(JSON.stringify(DEFAULT_PRICING), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data) {
      console.log("No group pricing found, returning defaults");
      return new Response(JSON.stringify(DEFAULT_PRICING), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pricing = data.setting_value as PricingData;
    console.log("Returning pricing:", pricing);

    return new Response(
      JSON.stringify({
        standard_price: pricing.standard_price ?? DEFAULT_PRICING.standard_price,
        urgent_price: pricing.urgent_price ?? DEFAULT_PRICING.urgent_price,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify(DEFAULT_PRICING), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
