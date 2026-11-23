import { NextResponse } from "next/server";

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
  const status = message === "UNAUTHENTICATED" ? 401 :
    message === "FORBIDDEN" ? 403 :
    message === "NOT_FOUND" ? 404 :
    message === "CONFLICT" ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}
