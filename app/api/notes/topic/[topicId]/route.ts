import { Note } from "@/lib/interfaces/note";
import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ topicId: string }> }
): Promise<NextResponse<ResponseType<Note[] | null>>> {
    try {
        const { topicId } = await params;
        const notes: Note[] = await prisma.note.findMany({
            where: {
                topicId: topicId,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Notes found",
            data: notes,
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred",
            data: null,
        });
    }
}
