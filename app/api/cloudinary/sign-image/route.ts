import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("Request ", request);
        const body = (await request.json()) as {
            paramsToSign: Record<string, string>;
        };
        const { paramsToSign } = body;
        const secret = process.env.CLOUDINARY_API_SECRET as string;
        console.log("Secret ", secret);
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            secret
        );

        return NextResponse.json({ signature });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to sign upload" },
            { status: 500 }
        );
    }
}
