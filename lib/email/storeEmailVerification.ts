import jwt from "jsonwebtoken";

export const storeEmailVerification = (
    email: string,
    code: string
): string | null => {
    try {
        const token = jwt.sign(
            { email, code },
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: "1d" }
        );
        return token;
    } catch {
        return null;
    }
};
