import { newNoteQuestionSchema } from "@/lib/definitions/newNoteQuestionSchema";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { NoteQuestionDB } from "@/lib/interfaces/noteQuestionDB";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ResponseType<NoteQuestionDB[] | null>>> {
    try {
        const noteQuestions = await prisma.noteQuestion.findMany();
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

export async function POST(req: NextRequest): Promise<NextResponse<ResponseType<null>>> {
    try {
        const body = await req.json();
        const noteQuestion = body;

        if (!newNoteQuestionSchema.safeParse(noteQuestion).success) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required fields: question, questionType, number and noteId.",
                data: null,
            });
        }

        await prisma.noteQuestion.create({
            data: noteQuestion,
        });

        return NextResponse.json({
            success: true,
            message: "Note question created successfully.",
            data: null,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        })
    }
}