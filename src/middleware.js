import { updateSession } from "./app/lib/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/dashboard', '/profile', '/admin/:path*'], // sesuaikan dengan route kamu
};
