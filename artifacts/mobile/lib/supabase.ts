import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase Real-time SaaS project URL and Anon/Publishable Key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://fhczxpqucqcnhgglsddp.supabase.co";
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || "sb_publishable_UWwQTC3oU5DQkYliHHGi9g_v1z5DmgF";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
