import { NextResponse } from "next/server";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import prisma from "@/utils/prisma";
import { NoteDb } from "@/lib/interfaces/note";

// GET: Retrieve a single note by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const note = await prisma.note.findUnique({
            where: { id: id },
        });

        if (!note) {
            return NextResponse.json(
                { success: false, message: "Note not found." },
                { status: 200 }
            );
        }

        const response: ResponseType<typeof note> = {
            success: true,
            message: "Note found.",
            data: note,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred while registering user.",
            data: null,
        });
    }
}

// PUT: Update an existing note
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { content, topicId, number } = body;

        if (!content || !topicId || !number) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: content, topicId and number.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const updatedNote: NoteDb = await prisma.note.update({
            where: { id: id },
            data: {
                content,
                topicId,
                number,
            },
        });

        const response: ResponseType<NoteDb> = {
            success: true,
            message: "Note updated successfully.",
            data: updatedNote,
        };
        return NextResponse.json(response);
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred while registering user.",
            data: null,
        });
    }
}

// DELETE: Delete a note by ID
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseType<null>>> {
    try {
        const { id } = await params;
        const noteToDelete = await prisma.note.findUnique({
            where: { id: id },
        });
        if (!noteToDelete) {
            return NextResponse.json({
                success: false,
                message: "Note not found.",
                data: null,
            });
        }
        await prisma.note.delete({
            where: { id: id },
        });
        return NextResponse.json({
            success: true,
            message: "Note deleted successfully.",
            data: null,
        });
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred while registering user.",
            data: null,
        });
    }
}
