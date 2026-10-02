import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Antes se llamaba "middleware" (Next 16 lo renombró a "proxy"): corre
// antes de cada página para refrescar la sesión y proteger /admin y
// /cuenta/pedidos (ver updateSession).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
