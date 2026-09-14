import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side client (for Server Components, API routes, Server Actions)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

// Client-side client (for Client Components)
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Admin client (for server-side operations with service role)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Real-time subscriptions helpers
export const REALTIME_CHANNELS = {
  PROJECTS: 'projects_changes',
  COMMENTS: 'comments_changes',
  MESSAGES: 'messages_changes',
  NOTIFICATIONS: 'notifications_changes',
  ONLINE_USERS: 'online_users',
} as const;

export function subscribeToProjects(
  client: ReturnType<typeof createBrowserSupabaseClient>,
  callback: (payload: any) => void
) {
  return client
    .channel(REALTIME_CHANNELS.PROJECTS)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Project' },
      callback
    )
    .subscribe();
}

export function subscribeToComments(
  client: ReturnType<typeof createBrowserSupabaseClient>,
  projectId: string,
  callback: (payload: any) => void
) {
  return client
    .channel(`${REALTIME_CHANNELS.COMMENTS}_${projectId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Comment', filter: `projectId=eq.${projectId}` },
      callback
    )
    .subscribe();
}

export function subscribeToMessages(
  client: ReturnType<typeof createBrowserSupabaseClient>,
  userId: string,
  callback: (payload: any) => void
) {
  return client
    .channel(`${REALTIME_CHANNELS.MESSAGES}_${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Message', filter: `receiverId=eq.${userId}` },
      callback
    )
    .subscribe();
}

export function subscribeToNotifications(
  client: ReturnType<typeof createBrowserSupabaseClient>,
  userId: string,
  callback: (payload: any) => void
) {
  return client
    .channel(`${REALTIME_CHANNELS.NOTIFICATIONS}_${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Notification', filter: `userId=eq.${userId}` },
      callback
    )
    .subscribe();
}