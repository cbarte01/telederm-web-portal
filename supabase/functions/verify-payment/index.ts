import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Create Supabase client with service role for updating consultations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { session_id, consultation_id } = await req.json();
    logStep("Request body", { session_id, consultation_id });

    if (!session_id || !consultation_id) {
      throw new Error("session_id and consultation_id are required");
    }

    // Initialize Stripe and retrieve session
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    logStep("Session retrieved", { 
      status: session.payment_status, 
      paymentIntentId: typeof session.payment_intent === "object" ? session.payment_intent?.id : session.payment_intent 
    });

    // Verify session belongs to this consultation
    if (session.metadata?.consultation_id !== consultation_id) {
      throw new Error("Session does not match consultation");
    }

    // Verify session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      throw new Error("Session does not belong to this user");
    }

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ 
        success: false, 
        status: session.payment_status,
        message: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get payment intent ID
    const paymentIntentId = typeof session.payment_intent === "object" 
      ? session.payment_intent?.id 
      : session.payment_intent;

    // Update consultation with payment info
    const { error: updateError } = await supabaseClient
      .from("consultations")
      .update({
        payment_status: "paid",
        stripe_payment_intent_id: paymentIntentId,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", consultation_id)
      .eq("patient_id", user.id);

    if (updateError) {
      logStep("Error updating consultation", { error: updateError.message });
      throw new Error(`Failed to update consultation: ${updateError.message}`);
    }

    logStep("Consultation updated successfully", { consultation_id });

    return new Response(JSON.stringify({ 
      success: true, 
      status: "paid",
      payment_intent_id: paymentIntentId,
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
