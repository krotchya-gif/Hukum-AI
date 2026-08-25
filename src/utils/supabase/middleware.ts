import { createServerClient } from "@supabase/ssr";
import { type NextRequest, type NextResponse } from "next/server";

// Menyegarkan sesi Supabase pada setiap request navigasi: bila access
// token mendekati kedaluwarsa, getUser() memicu refresh dan token baru
// ditulis ke cookie pada response yang sedang berjalan. Tanpa ini user
// yang membiarkan tab terbuka akan kehilangan sesi saat refresh token
// berotasi tapi tidak pernah tersimpan.
export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Cukup memanggil getUser untuk memicu refresh token bila perlu.
  await supabase.auth.getUser();
}
