import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

// Rutas públicas (no requieren sesión).
const PUBLIC = ["/login", "/api/login", "/api/logout"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token === expectedToken()) {
    return NextResponse.next();
  }

  // Sin sesión válida → redirige a /login conservando el destino.
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Protege todo excepto assets estáticos y archivos con extensión.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
