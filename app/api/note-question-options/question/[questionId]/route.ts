import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { NoteQuestionOption } from "@/lib/interfaces/noteQuestionOption";

export async function GET (req: NextRequest, {params}: {params: Promise<{questionId: string}>}): Promise<NextResponse<ResponseType<NoteQuestionOption[] | null>>> {
    try {
        const { questionId } = await params;
        const noteQuestionOptions = await prisma.noteQuestionOption.findMany({
                where: {
                    noteQuestionId: questionId,
                },
            });
        return NextResponse.json({
            success: true,
            message: "Note questions found.",
            data: noteQuestionOptions,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<NoteQuestionOption[]>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}