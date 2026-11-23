import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/rbac";
import { errorResponse } from "@/lib/http";

const schema = z.object({
  campaignId: z.string().uuid(),
  amount: z.number().int().positive(),
  purpose: z.string().min(10).max(5000)
});

export async function GET() {
  try {
    await requireAnyRole(["FINANCE_ADMIN", "SUPER_ADMIN", "CAMPAIGN_ADMIN"]);
    const allocations = await prisma.allocation.findMany({
      include: { campaign: true, requester: { select: { id: true, name: true } }, approvalEvent: { include: { reviewer: { select: { name: true } } } } },
      orderBy: { requestedAt: "desc" }
    });
    return NextResponse.json({ allocations });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireAnyRole(["FINANCE_ADMIN", "SUPER_ADMIN", "CAMPAIGN_ADMIN"]);
    const input = schema.parse(await request.json());
    const campaign = await prisma.campaign.findUnique({ where: { id: input.campaignId } });
    if (!campaign) return NextResponse.json({ error: "Campaign tidak ditemukan." }, { status: 404 });

    const allocation = await prisma.allocation.create({
      data: {
        allocationNumber: `ALK-${Date.now()}`,
        campaignId: input.campaignId,
        amount: BigInt(input.amount),
        purpose: input.purpose,
        requestedBy: user.id
      }
    });
    return NextResponse.json({ allocation }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
