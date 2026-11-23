import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireFinanceApprover } from "@/lib/rbac";
import { errorResponse } from "@/lib/http";

const schema = z.object({ note: z.string().min(5).max(3000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const reviewer = await requireFinanceApprover();
    const { id } = await context.params;
    const input = schema.parse(await request.json());

    await prisma.$transaction(async (tx) => {
      const allocation = await tx.allocation.findUnique({ where: { id } });
      if (!allocation || allocation.status !== "PENDING") throw new Error("CONFLICT");
      if (allocation.requestedBy === reviewer.id) throw new Error("Tidak boleh menolak pengajuan sendiri.");

      const changed = await tx.allocation.updateMany({
        where: { id, status: "PENDING" },
        data: { status: "REJECTED", rejectedAt: new Date() }
      });
      if (changed.count !== 1) throw new Error("CONFLICT");

      await tx.allocationApprovalEvent.create({
        data: { allocationId: id, reviewerId: reviewer.id, decision: "REJECTED", note: input.note }
      });
      await tx.auditLog.create({
        data: {
          actorUserId: reviewer.id, action: "ALLOCATION_REJECTED",
          entityType: "Allocation", entityId: id,
          newValues: { status: "REJECTED", note: input.note }
        }
      });
    });

    return NextResponse.json({ message: "Pengajuan berhasil ditolak." });
  } catch (error) { return errorResponse(error); }
}
