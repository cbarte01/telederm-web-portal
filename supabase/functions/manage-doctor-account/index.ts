import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the caller's JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the caller has admin role
    const { data: adminRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !adminRole) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { action, doctor_id } = await req.json();

    if (!action || !doctor_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action, doctor_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing action: ${action} for doctor: ${doctor_id}`);

    // Verify the target user is a doctor
    const { data: doctorRole, error: doctorRoleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', doctor_id)
      .eq('role', 'doctor')
      .single();

    if (doctorRoleError || !doctorRole) {
      console.error('Doctor role check error:', doctorRoleError);
      return new Response(
        JSON.stringify({ error: 'User is not a doctor' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'deactivate': {
        // Set is_active to false
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ is_active: false })
          .eq('id', doctor_id);

        if (updateError) {
          console.error('Deactivation error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to deactivate doctor' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Doctor ${doctor_id} deactivated successfully`);
        return new Response(
          JSON.stringify({ success: true, message: 'Doctor deactivated successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reactivate': {
        // Set is_active to true
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ is_active: true })
          .eq('id', doctor_id);

        if (updateError) {
          console.error('Reactivation error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to reactivate doctor' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Doctor ${doctor_id} reactivated successfully`);
        return new Response(
          JSON.stringify({ success: true, message: 'Doctor reactivated successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        // Check for active consultations (in_review status)
        const { data: activeConsultations, error: consultError } = await supabaseAdmin
          .from('consultations')
          .select('id')
          .eq('doctor_id', doctor_id)
          .eq('status', 'in_review');

        if (consultError) {
          console.error('Consultation check error:', consultError);
          return new Response(
            JSON.stringify({ error: 'Failed to check for active consultations' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (activeConsultations && activeConsultations.length > 0) {
          return new Response(
            JSON.stringify({ 
              error: 'Cannot delete doctor with active consultations. Please reassign or complete them first.',
              active_consultations: activeConsultations.length
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Unassign completed consultations from this doctor (set doctor_id to null)
        const { error: unassignError } = await supabaseAdmin
          .from('consultations')
          .update({ doctor_id: null })
          .eq('doctor_id', doctor_id);

        if (unassignError) {
          console.error('Unassign consultations error:', unassignError);
          return new Response(
            JSON.stringify({ error: 'Failed to unassign consultations' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete user role
        const { error: roleDeleteError } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', doctor_id);

        if (roleDeleteError) {
          console.error('Role delete error:', roleDeleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete doctor role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete profile
        const { error: profileDeleteError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', doctor_id);

        if (profileDeleteError) {
          console.error('Profile delete error:', profileDeleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete doctor profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete auth user
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(doctor_id);

        if (authDeleteError) {
          console.error('Auth delete error:', authDeleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete doctor auth account' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Doctor ${doctor_id} permanently deleted`);
        return new Response(
          JSON.stringify({ success: true, message: 'Doctor permanently deleted' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: deactivate, reactivate, or delete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
