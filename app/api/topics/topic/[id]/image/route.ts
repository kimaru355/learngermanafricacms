import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";

// PUT: Update an existing topic
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            const response: ResponseType<null> = {
                success: false,
                message: "Please provide the imageUrl.",
                data: null,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const updatedTopic = await prisma.topic.update({
            where: { id: id },
            data: {
                imageUrl,
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
