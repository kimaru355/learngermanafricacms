import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

export async function PUT (req: Request, {params}: {params: Promise<{id: string}>}): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        const { question, questionType, number } = await req.json();
        const prevQuestion = await prisma.noteQuestion.findUnique({
            where: {
                id,
            }
        });
        if (!prevQuestion) {
            return NextResponse.json({
                success: false,
                message: "Note question not found.",
                data: null,
            });
        }
        // delete all question options if the question type has changed
        if (prevQuestion.questionType !== questionType) {
            await prisma.noteQuestionOption.deleteMany({
                where: {
                    noteQuestionId: id,
                },
            });
        }
        await prisma.noteQuestion.update({
            where: {
                id,
            },
            data: {
                question,
                questionType,
                number,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Note question updated.",
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
        await prisma.noteQuestionOption.deleteMany({
            where: {
                noteQuestionId: id,
            },
        })
        await prisma.noteQuestion.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Note question deleted.",
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