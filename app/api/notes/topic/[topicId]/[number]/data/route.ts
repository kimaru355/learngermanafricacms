import { NoteDb } from "@/lib/interfaces/note";
import { NoteWithDetailsDb } from "@/lib/interfaces/noteWithDetails";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ topicId: string; number: string }> }
): Promise<NextResponse<ResponseType<NoteWithDetailsDb | null>>> {
    try {
        const { topicId, number } = await params;
        if (!number || !topicId || isNaN(parseInt(number))) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please provide all required fields: number, topicId.",
                    data: null,
                },
                { status: 200 }
            );
        }

        const note: NoteDb | null = await prisma.note.findFirst({
            where: { topicId: topicId, number: +number },
        });
        if (!note) {
            return NextResponse.json({
                success: false,
                message: "Note not found",
                data: null,
            });
        }
        const topic = await prisma.topic.findUnique({
            where: {
                id: note.topicId,
            },
        });
        if (!topic) {
            return NextResponse.json({
                success: false,
                message: "Topic not found",
                data: null,
            });
        }
        const count: number = await prisma.note.count({
            where: {
                topicId: note.topicId,
            },
        });

        const noteWithDetails: NoteWithDetailsDb = {
            note,
            topic,
            count,
        };

        return NextResponse.json({
            success: true,
            message: "Note found",
            data: noteWithDetails,
        });
    } catch (error: unknown) {
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
