import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "PUBLISHED" },
    include: {
      pillar: true,
      policies: { where: { isActive: true }, take: 1, orderBy: { version: "desc" } },
      donations: { where: { status: "PAID" }, select: { amount: true } }
    },
    orderBy: { publishedAt: "desc" }
  });

  const data = campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    slug: campaign.slug,
    shortDescription: campaign.shortDescription,
    description: campaign.description,
    targetAmount: campaign.targetAmount.toString(),
    pillar: campaign.pillar.name,
    coverImage: campaign.coverImage,
    policy: campaign.policies[0] ? {
      title: campaign.policies[0].policyTitle,
      description: campaign.policies[0].policyDescription,
      version: campaign.policies[0].version
    } : null,
    collectedAmount: campaign.donations.reduce((sum, donation) => sum + donation.amount, 0n).toString()
  }));

  return NextResponse.json({ campaigns: data });
}
