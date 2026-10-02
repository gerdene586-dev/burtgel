const SUPABASE_URL = "";
const SUPABASE_PUBLISHABLE_KEY = "";

const supabaseClient =
  SUPABASE_URL &&
  SUPABASE_PUBLISHABLE_KEY &&
  window.supabase &&
  typeof window.supabase.createClient === "function"
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;