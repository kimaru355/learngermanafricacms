import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { NoteQuestionDB } from "@/lib/interfaces/noteQuestionDB";

export async function GET (req: NextRequest, {params}: {params: Promise<{noteId: string}>}): Promise<NextResponse<ResponseType<NoteQuestionDB[] | null>>> {
    try {
        const { noteId } = await params;
        const noteQuestions = await prisma.noteQuestion.findMany({
                where: {
                    noteId,
                },
            });
        return NextResponse.json({
            success: true,
            message: "Note questions found.",
            data: noteQuestions,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<NoteQuestionDB[]>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}