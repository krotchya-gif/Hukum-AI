import { createClient } from "@supabase/supabase-js";

// Client dengan service-role key: bypass RLS. HANYA untuk server
// (webhook pembayaran, pembuatan profil saat registrasi). Jangan pernah
// dipakai di kode yang menerima input dari client tanpa validasi.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createAdminClient = () =>
  createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
