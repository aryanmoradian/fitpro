
import { createClient } from '@supabase/supabase-js';

// Access environment variables
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// DETECT MOCK MODE: If env vars are missing or set to placeholder values
export const isMock = !envUrl || !envKey || envUrl === 'mock-url' || envUrl.includes('placeholder');

if (isMock) {
  console.log('⚡ Running in AUTH MOCK MODE (Google AI Studio Compatibility)');
}

// Create client (if real) or a dummy object (if mock) to prevent crashes
export const supabase = isMock 
  ? {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async ({ email, password }: any) => {
            // Mock Login Logic
            if(email && password) return { data: { user: { id: 'mock-user-id', email, user_metadata: { role: 'athlete', first_name: 'Mock', last_name: 'User' } } }, error: null };
            return { data: { user: null }, error: { message: 'Invalid credentials' } };
        },
        signUp: async ({ email }: any) => {
            // Mock Register Logic
            return { data: { user: null }, error: null }; // Simulate email confirmation required
        },
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      storage: {
          from: () => ({
              upload: async () => ({ data: {}, error: null }),
              getPublicUrl: () => ({ data: { publicUrl: 'https://placehold.co/400' } })
          })
      }
    } as any
  : createClient(envUrl!, envKey!);
