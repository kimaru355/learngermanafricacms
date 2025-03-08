import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { NoteQuestionOption } from "@/lib/interfaces/noteQuestionOption";
import validateUpdatingQuestionOption from "@/lib/helpers/validateUpdatingQuestionOption";
import validateDeletingQuestionOption from "@/lib/helpers/validateDeletingQuestionOption";

export async function PUT (req: Request, {params}: {params: Promise<{id: string}>}): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        const noteQuestionOption: NoteQuestionOption = await req.json();
        if (!noteQuestionOption.id || !noteQuestionOption.option || !noteQuestionOption.noteQuestionId || (noteQuestionOption.isCorrect !== true && noteQuestionOption.isCorrect !== false)) {
            return NextResponse.json({
                success: false,
                message: "Please provide all required fields: id, option, isCorrect and noteQuestionId.",
                data: null,
            });
        }
        const noteQuestionOptions = await prisma.noteQuestionOption.findMany({
            where: {
                noteQuestionId: noteQuestionOption.noteQuestionId
            }
        });
        const question = await prisma.noteQuestion.findUnique({
            where: {
                id: noteQuestionOption.noteQuestionId
            }
        });
        if (!question) {
            return NextResponse.json({
                success: false,
                message: "Note question not found.",
                data: null,
            });
        };
        const response = validateUpdatingQuestionOption(noteQuestionOptions, noteQuestionOption, question);
        if (!response.success) {
            return NextResponse.json(response);
        } else if (response.message === "update single choice") {
            await prisma.noteQuestionOption.updateMany({
                where: {
                    noteQuestionId: noteQuestionOption.noteQuestionId
                },
                data: {
                    isCorrect: false
                }
            })
        }
        await prisma.noteQuestionOption.update({
            where: {
                id,
            },
            data: {
                option: noteQuestionOption.option,
                isCorrect: noteQuestionOption.isCorrect,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Note question option updated.",
            data: null,
        });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}

export async function DELETE (req: Request, {params}: {params: Promise<{id: string}>}): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        const questionOption = await prisma.noteQuestionOption.findUnique({
            where: {
                id,
            },
        });
        if (!questionOption) {
            return NextResponse.json({
                success: false,
                message: "Note question option not found.",
                data: null,
            });
        }
        const question = await prisma.noteQuestion.findUnique({
            where: {
                id: questionOption.noteQuestionId
            }
        });
        if (!question) {
            return NextResponse.json({
                success: false,
                message: "Note question not found.",
                data: null,
            });
        }
        const noteQuestionOptions = await prisma.noteQuestionOption.findMany({
            where: {
                noteQuestionId: questionOption.noteQuestionId
            }
        });
        const result = validateDeletingQuestionOption(noteQuestionOptions, questionOption, question);
        if (!result.success) {
            return NextResponse.json(result);
        }
        await prisma.noteQuestionOption.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Note question option deleted.",
            data: null,
        });
    } catch (error: unknown) {
        console.error(error)
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError<null>(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred.",
            data: null,
        });
    }
}