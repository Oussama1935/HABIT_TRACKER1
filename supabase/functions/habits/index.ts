import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (req.method) {
      case 'GET': {
        if (path === 'stats') {
          const { data: { user } } = await supabaseClient.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] ?? ''
          );

          if (!user) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized' }),
              { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const { data: habits } = await supabaseClient
            .from('habits')
            .select('*')
            .eq('user_id', user.id);

          const stats = {
            total: habits?.length ?? 0,
            completed: habits?.filter(h => h.completed_today).length ?? 0,
            streaks: habits?.reduce((acc, h) => acc + (h.streak ?? 0), 0) ?? 0,
          };

          return new Response(
            JSON.stringify(stats),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;
      }

      case 'POST': {
        if (path === 'reset-daily') {
          const { data: { user } } = await supabaseClient.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] ?? ''
          );

          if (!user) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized' }),
              { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Reset completed_today status and update streaks
          const { data: habits } = await supabaseClient
            .from('habits')
            .select('*')
            .eq('user_id', user.id);

          if (habits) {
            for (const habit of habits) {
              await supabaseClient
                .from('habits')
                .update({
                  completed_today: false,
                  streak: habit.completed_today ? habit.streak : 0,
                })
                .eq('id', habit.id);
            }
          }

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});