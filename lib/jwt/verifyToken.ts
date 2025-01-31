import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
// import { getJwtSecretKey } from "./getJwtSecret";

export default function verifyToken(req: NextRequest): NextResponse {
    try {
        const cookie = req.cookies.get("auth_token");
        if (!cookie || !cookie.value) {
            console.log("cookie not found");
            return NextResponse.json(
                {
                    success: false,
                    message: "Token not found",
                    data: null,
                },
                {
                    status: 401,
                }
            );
        }
        const auth_token = cookie.value;
        console.log("auth token ", auth_token);
        const secret = "getJwtSecretKey()";
        console.log("secret", secret);
        jwt.verify(auth_token, secret);
        return NextResponse.next();
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
                data: null,
            },
            {
                status: 401,
            }
        );
    }
}
