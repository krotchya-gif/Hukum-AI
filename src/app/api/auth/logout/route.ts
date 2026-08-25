import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// NextResponse.redirect menuntut URL absolut — URL relatif melempar error.
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/id/login", req.url), { status: 302 });
}
