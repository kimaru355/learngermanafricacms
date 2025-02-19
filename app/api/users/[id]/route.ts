import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        if (!id) {
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
                isDeleted: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
            data: null,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "Error deleting user",
            data: null,
        });
    }
}
