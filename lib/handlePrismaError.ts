import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NextResponse } from "next/server";

export const handlePrismaError = (
    error: PrismaClientKnownRequestError
): NextResponse<ResponseType<null>> => {
    console.log(error.message);
    return NextResponse.json({
        success: false,
        message: "An error occurred.",
        data: null,
    });
};
