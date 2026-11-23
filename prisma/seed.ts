import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    ["DONOR", "Donatur"],
    ["CONTENT_ADMIN", "Admin Konten"],
    ["CAMPAIGN_ADMIN", "Admin Program"],
    ["FINANCE_ADMIN", "Admin Keuangan"],
    ["SUPER_ADMIN", "Super Admin"]
  ] as const;

  for (const [code, name] of roles) {
    await prisma.role.upsert({
      where: { code },
      update: { name },
      create: { code, name, description: `Role ${name}` }
    });
  }

  const pillarSeeds = [
    { name: "Wakaf Al-Qur’an dan Pembinaan", slug: "wakaf-al-quran", description: "Wakaf Al-Qur’an dan pembinaan umat.", sortOrder: 1 },
    { name: "Air Kemanusiaan", slug: "air-kemanusiaan", description: "Akses air bersih dan bantuan kemanusiaan.", sortOrder: 2 },
    { name: "Pendidikan", slug: "pendidikan", description: "Dukungan pendidikan dan pengembangan generasi.", sortOrder: 3 },
    { name: "Kesehatan", slug: "kesehatan", description: "Dukungan layanan dan kebutuhan kesehatan.", sortOrder: 4 },
    { name: "Donasi Umum", slug: "donasi-umum", description: "Program donasi umum dengan kebijakan khusus per campaign.", sortOrder: 5 }
  ];

  for (const pillar of pillarSeeds) {
    await prisma.pillar.upsert({ where: { slug: pillar.slug }, update: pillar, create: pillar });
  }

  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) throw new Error("BOOTSTRAP_ADMIN_PASSWORD minimal 12 karakter.");
    const role = await prisma.role.findUniqueOrThrow({ where: { code: "SUPER_ADMIN" } });
    const passwordHash = await hash(adminPassword, 12);
    const user = await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: {},
      create: { name: "Super Admin", email: adminEmail.toLowerCase(), passwordHash }
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id }
    });
    console.log("Bootstrap Super Admin:", adminEmail);
  } else {
    console.log("Role dan pilar dibuat. Atur BOOTSTRAP_ADMIN_EMAIL/PASSWORD untuk membuat Super Admin awal.");
  }
}

main().finally(async () => prisma.$disconnect());
