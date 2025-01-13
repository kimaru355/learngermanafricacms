import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

const prisma = new PrismaClient();

// GET: Retrieve a single topic by ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const topic = await prisma.topic.findUnique({
            where: { id: id },
        });

        if (!topic) {
            return NextResponse.json(
                { success: false, message: "Topic not found." },
                { status: 200 }
            );
        }

        const response: ResponseType<typeof topic> = {
            success: true,
            message: "Topic found.",
            data: topic,
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

// PUT: Update an existing topic
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, description, imageUrl, levelId } = body;

        if (!name || !description || !imageUrl || !levelId) {
            const response: ResponseType<null> = {
                success: false,
                message:
                    "Please provide all required fields: name, description, imageUrl, levelId.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const updatedTopic = await prisma.topic.update({
            where: { id: id },
            data: {
                name,
                description,
                imageUrl,
                levelId,
            },
        });

        const response: ResponseType<typeof updatedTopic> = {
            success: true,
            message: "Topic updated successfully.",
            data: updatedTopic,
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

// DELETE: Delete a topic by ID
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deletedTopic = await prisma.topic.delete({
            where: { id: id },
        });

        const response: ResponseType<typeof deletedTopic> = {
            success: true,
            message: "Topic deleted successfully.",
            data: deletedTopic,
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
