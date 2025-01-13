import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

const prisma = new PrismaClient();

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
        const { markdown, topicId } = body;

        if (!markdown || !topicId) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: markdown, topicId.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const updatedNote = await prisma.note.update({
            where: { id: id },
            data: {
                markdown,
                topicId,
            },
        });

        const response: ResponseType<typeof updatedNote> = {
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
) {
    try {
        const { id } = await params;
        const deletedNote = await prisma.note.delete({
            where: { id: id },
        });

        const response: ResponseType<typeof deletedNote> = {
            success: true,
            message: "Note deleted successfully.",
            data: deletedNote,
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
