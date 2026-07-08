import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = ((import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL) || (process.env?.NEXT_PUBLIC_SUPABASE_URL) || "";
const supabaseKey = ((import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    typeof supabaseKey === "string" &&
    supabaseKey.length > 0
  );
};

export const createClient = () => {
  return createBrowserClient(
    supabaseUrl || "https://placeholder-url-for-supabase.supabase.co",
    supabaseKey || "placeholder-key"
  );
};
