import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        const { role } = await req.json();
        if (!id || !role || !["AGENT", "ADMIN"].includes(role)) {
            return NextResponse.json({
                success: false,
                message: "Invalid request",
                data: null,
            });
        }
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
        });
        return NextResponse.json({
            success: true,
            message: "User role updated",
            data: null,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "Error updating user role",
            data: null,
        });
    }
}
