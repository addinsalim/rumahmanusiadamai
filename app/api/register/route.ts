import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });

    const passwordHash = await hash(input.password, 12);
    const donorRole = await prisma.role.findUnique({ where: { code: "DONOR" } });
    if (!donorRole) return NextResponse.json({ error: "Role DONOR belum di-seed." }, { status: 500 });

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
        userRoles: { create: { roleId: donorRole.id } }
      },
      select: { id: true, name: true, email: true }
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Data registrasi tidak valid." }, { status: 400 });
  }
}
