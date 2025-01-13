import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { UserLogin } from "@/lib/interfaces/user";
import { UserLoginSchema } from "@/lib/definitions/userSchema";

export async function POST(
    req: Request
): Promise<NextResponse<ResponseType<null>>> {
    try {
        dotenv.config();
        const prisma = new PrismaClient();
        const userLogin: UserLogin = await req.json();

        // Validate the user input using schema
        try {
            UserLoginSchema.parse(userLogin);
        } catch {
            return NextResponse.json({
                success: false,
                message:
                    "Invalid data provided. Email and password are required.",
                data: null,
            });
        }

        const { email, password } = userLogin;

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Please provide both email and password.",
                data: null,
            });
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log("user", user);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password.",
                data: null,
            });
        } else if (!user.password) {
            return NextResponse.json({
                success: false,
                message:
                    "You cannot sign with password. Please use a social login.",
                data: null,
            });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password.",
                data: null,
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // Create the response with the Set-Cookie header
        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            data: null,
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production", // Use secure flag in production
            sameSite: "strict", // Prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/", // Makes the cookie available on all routes
        });

        return response;
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handlePrismaError(error);
        }
        return NextResponse.json({
            success: false,
            message: "An error occurred during login.",
            data: null,
        });
    }
}
