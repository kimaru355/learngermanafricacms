import { handlePrismaError } from "@/lib/handlePrismaError";
import validateNewQuestionOption from "@/lib/helpers/validateNewQuestionOption";
import { NewNoteQuestionOption, NoteQuestionOption } from "@/lib/interfaces/noteQuestionOption";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ResponseType<NoteQuestionOption[] | null>>> {
    try {
        const noteQuestionOptions = await prisma.noteQuestionOption.findMany();
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

export async function POST(req: NextRequest): Promise<NextResponse<ResponseType<null>>> {
    try {
        const body = await req.json();
        const noteQuestionOption: NewNoteQuestionOption = body;

        if (!noteQuestionOption.option || !noteQuestionOption.noteQuestionId || (noteQuestionOption.isCorrect !== true && noteQuestionOption.isCorrect !== false)) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required fields: option, isCorrect and noteQuestionId.",
                data: null,
            });
        }

        const noteQuestionOptions = await prisma.noteQuestionOption.findMany({
            where: {
                noteQuestionId: noteQuestionOption.noteQuestionId
            }
        });
        const noteQuestion = await prisma.noteQuestion.findUnique({
            where: {
                id: noteQuestionOption.noteQuestionId
            }
        })
        if (!noteQuestion) {
            return NextResponse.json({
                success: false,
                message: "Note question not found.",
                data: null,
            });
        }

        const response = validateNewQuestionOption(noteQuestionOptions, noteQuestionOption, noteQuestion);
        if (!response.success) {
            return NextResponse.json(response);
        }

        await prisma.noteQuestionOption.create({
            data: {
                option: noteQuestionOption.option,
                isCorrect: noteQuestionOption.isCorrect,
                noteQuestionId: noteQuestionOption.noteQuestionId
            },
        });

        return NextResponse.json({
            success: true,
            message: "Note question option created successfully.",
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