import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe price IDs - created via Lovable integration
const PRICE_IDS = {
  standard: "price_1SsuxeFQTVPZTcL7kWIAi54T", // €49
  urgent: "price_1SsuzeFQTVPZTcL7ElN8rKvW",   // €74
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { consultation_id, pricing_plan, custom_price } = await req.json();
    logStep("Request body", { consultation_id, pricing_plan, custom_price });

    if (!consultation_id || !pricing_plan) {
      throw new Error("consultation_id and pricing_plan are required");
    }

    // Determine which price to use
    let priceId = PRICE_IDS[pricing_plan as keyof typeof PRICE_IDS];
    let amount = pricing_plan === "urgent" ? 7400 : 4900; // in cents

    // If custom price is provided (from doctor's individual pricing), use that
    if (custom_price && typeof custom_price === "number") {
      amount = Math.round(custom_price * 100); // Convert euros to cents
      logStep("Using custom price", { amount, euros: custom_price });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    }

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://telederm-health.lovable.app";

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "payment",
      success_url: `${origin}/consultation/success?session_id={CHECKOUT_SESSION_ID}&consultation_id=${consultation_id}`,
      cancel_url: `${origin}/consultation?step=10`,
      metadata: {
        consultation_id,
        pricing_plan,
        user_id: user.id,
      },
      payment_intent_data: {
        metadata: {
          consultation_id,
          pricing_plan,
          user_id: user.id,
        },
      },
      line_items: [],
    };

    // Use price_id if standard pricing, otherwise use price_data for custom amounts
    if (!custom_price) {
      sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      sessionConfig.line_items = [{
        price_data: {
          currency: "eur",
          unit_amount: amount,
          product_data: {
            name: pricing_plan === "urgent" 
              ? "Dringliche Teledermatologie-Konsultation" 
              : "Standard Teledermatologie-Konsultation",
            description: pricing_plan === "urgent"
              ? "Antwort innerhalb von 12 Stunden"
              : "Antwort innerhalb von 48 Stunden",
          },
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
