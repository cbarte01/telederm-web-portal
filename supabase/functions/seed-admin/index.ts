import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Require a dedicated secret to prevent public invocation.
  // Caller must send: x-seed-admin-secret: <SEED_ADMIN_SECRET>
  const expectedSecret = Deno.env.get('SEED_ADMIN_SECRET')
  const providedSecret = req.headers.get('x-seed-admin-secret')

  if (!expectedSecret) {
    console.error('SEED_ADMIN_SECRET is not configured')
    return new Response(
      JSON.stringify({ error: 'Server misconfigured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')

    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ error: 'ADMIN_EMAIL and ADMIN_PASSWORD secrets must be configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingAdmin) {
      // Check if role already assigned
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', existingAdmin.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (existingRole) {
        return new Response(
          JSON.stringify({ message: 'Admin account already exists and has admin role', userId: existingAdmin.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Remove any auto-assigned patient role first
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', existingAdmin.id)
        .eq('role', 'patient')

      // Assign admin role to existing user
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: existingAdmin.id, role: 'admin' })

      if (roleError) throw roleError

      return new Response(
        JSON.stringify({ message: 'Admin role assigned to existing user', userId: existingAdmin.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (createError) throw createError

    // Create profile for admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({ id: newUser.user.id, full_name: 'System Administrator' })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    // Remove auto-assigned patient role (from trigger)
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', newUser.user.id)
      .eq('role', 'patient')

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: newUser.user.id, role: 'admin' })

    if (roleError) throw roleError

    return new Response(
      JSON.stringify({ message: 'Admin account created successfully', userId: newUser.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Seed admin error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
