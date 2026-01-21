import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation helpers
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_ACTIONS = ['deactivate', 'reactivate', 'delete'] as const;

function isValidUUID(id: unknown): id is string {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

function isValidAction(action: unknown): action is typeof ALLOWED_ACTIONS[number] {
  return typeof action === 'string' && ALLOWED_ACTIONS.includes(action as typeof ALLOWED_ACTIONS[number]);
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is an admin
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { action, patient_id } = await req.json();

    // Validate action is one of the allowed values
    if (!isValidAction(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Use: deactivate, reactivate, or delete" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate patient_id is a valid UUID
    if (!isValidUUID(patient_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid patient_id format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the target user is a patient
    const { data: patientRole, error: patientRoleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", patient_id)
      .eq("role", "patient")
      .single();

    if (patientRoleError || !patientRole) {
      return new Response(
        JSON.stringify({ error: "Target user is not a patient" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    switch (action) {
      case "deactivate": {
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_active: false })
          .eq("id", patient_id);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, message: "Patient deactivated" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reactivate": {
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_active: true })
          .eq("id", patient_id);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, message: "Patient reactivated" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        // Check for active consultations
        const { data: activeConsultations, error: consultError } = await supabaseAdmin
          .from("consultations")
          .select("id")
          .eq("patient_id", patient_id)
          .in("status", ["submitted", "in_review"])
          .limit(1);

        if (consultError) {
          throw consultError;
        }

        if (activeConsultations && activeConsultations.length > 0) {
          return new Response(
            JSON.stringify({ error: "Cannot delete patient with active consultations" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Delete from auth.users (will cascade to profiles and user_roles)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(patient_id);

        if (deleteError) {
          throw deleteError;
        }

        return new Response(
          JSON.stringify({ success: true, message: "Patient deleted" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Error in manage-patient-account:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
