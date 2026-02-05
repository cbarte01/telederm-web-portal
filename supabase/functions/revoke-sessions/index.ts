import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RevokeSessionsRequest {
  target_user_id?: string;
  reason?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client to validate the user's JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RevokeSessionsRequest = await req.json().catch(() => ({}));
    const targetUserId = body.target_user_id || user.id;
    const reason = body.reason || 'user_requested';

    // If targeting another user, verify the caller is an admin
    if (targetUserId !== user.id) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: isAdmin } = await adminClient.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: 'Only admins can revoke other users\' sessions' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Use service role client for database operations
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date().toISOString();

    // Upsert the session revocation record
    const { error: upsertError } = await serviceClient
      .from('session_revocations')
      .upsert({
        user_id: targetUserId,
        revoked_before: now,
        revoked_by: user.id,
        reason: targetUserId === user.id ? 'user_requested' : reason,
        updated_at: now
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('Error upserting session revocation:', upsertError);
      return new Response(
        JSON.stringify({ error: 'Failed to revoke sessions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log security event
    const eventType = targetUserId === user.id ? 'session_revoked_self' : 'session_revoked_admin';
    const { error: logError } = await serviceClient
      .from('security_events')
      .insert({
        user_id: targetUserId,
        event_type: eventType,
        details: {
          revoked_by: user.id,
          reason,
          target_user_id: targetUserId
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || null,
        user_agent: req.headers.get('user-agent') || null
      });

    if (logError) {
      console.warn('Failed to log security event:', logError);
      // Don't fail the request for logging issues
    }

    console.log(`Sessions revoked for user ${targetUserId} by ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All sessions revoked successfully',
        revoked_before: now
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Revoke sessions error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
