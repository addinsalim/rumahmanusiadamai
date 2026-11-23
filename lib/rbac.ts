import { auth } from "@/auth";

export type RoleCode = "DONOR" | "CONTENT_ADMIN" | "CAMPAIGN_ADMIN" | "FINANCE_ADMIN" | "SUPER_ADMIN";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user;
}

export async function requireAnyRole(allowed: RoleCode[]) {
  const user = await requireUser();
  if (!allowed.some((role) => user.roles?.includes(role))) throw new Error("FORBIDDEN");
  return user;
}

export async function requireFinanceApprover() {
  return requireAnyRole(["FINANCE_ADMIN", "SUPER_ADMIN"]);
}
