import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DonationForm } from "@/components/donation-form";

export const dynamic = "force-dynamic";

export default async function DonationPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { campaignId } = await params;
  const campaign = await prisma.campaign.findFirst({ where: { id: campaignId, status: "PUBLISHED" } });
  if (!campaign) notFound();
  return <main className="container-page max-w-2xl py-12"><h1 className="text-3xl font-extrabold">Donasi untuk {campaign.title}</h1><p className="mt-2 text-slate-500">Pilih nominal dan pengaturan nama donatur.</p><DonationForm campaignId={campaign.id} /></main>;
}
