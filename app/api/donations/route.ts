import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  campaignId: z.string().uuid(),
  amount: z.number().int().min(1000).max(1_000_000_000),
  isAnonymous: z.boolean().default(true),
  donorDisplayName: z.string().max(150).optional()
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Login diperlukan untuk berdonasi." }, { status: 401 });

  try {
    const input = schema.parse(await request.json());
    const campaign = await prisma.campaign.findFirst({
      where: { id: input.campaignId, status: "PUBLISHED" },
      include: { policies: { where: { isActive: true }, take: 1, orderBy: { version: "desc" } } }
    });
    if (!campaign || !campaign.policies[0]) {
      return NextResponse.json({ error: "Campaign atau kebijakan donasi tidak tersedia." }, { status: 400 });
    }

    const donation = await prisma.$transaction(async (tx) => {
      const created = await tx.donation.create({
        data: {
          donationNumber: `RMD-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          userId: session.user.id,
          campaignId: campaign.id,
          fundPolicyId: campaign.policies[0].id,
          amount: BigInt(input.amount),
          isAnonymous: input.isAnonymous,
          donorDisplayName: input.isAnonymous ? null : (input.donorDisplayName || session.user.name || "Donatur")
        }
      });
      await tx.donationStatusHistory.create({
        data: { donationId: created.id, toStatus: "PENDING_PAYMENT", actorUserId: session.user.id, reason: "Donasi dibuat." }
      });
      return created;
    });

    // Pembayaran Midtrans sengaja belum dibuat di endpoint ini.
    // Integrasikan Snap setelah kredensial Sandbox tersedia.
    return NextResponse.json({
      donation: { id: donation.id, donationNumber: donation.donationNumber, status: donation.status },
      nextStep: "PAYMENT_PROVIDER_NOT_CONFIGURED"
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Permintaan donasi tidak valid." }, { status: 400 });
  }
}
