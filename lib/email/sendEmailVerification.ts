import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { ResponseType } from "../interfaces/ResponseType";
import { EmailVerification } from "../interfaces/emailVerification";
import { storeEmailVerification } from "./storeEmailVerification";

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;
if (!user || !pass) {
    throw new Error("Email credentials not provided.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: user,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const renderTemplate = (filePath: string, data: object): Promise<string> =>
    new Promise((resolve, reject) => {
        ejs.renderFile(filePath, data, (err, str) => {
            if (err) {
                return reject(err);
            }
            resolve(str);
        });
    });

export const sendEmailVerification = async (
    email: string,
    code: string
): Promise<ResponseType<null>> => {
    const templatePath = path.join(
        process.cwd(),
        "templates",
        "mailer",
        "verifyEmail.ejs"
    );
    const token = storeEmailVerification(email, code);
    if (!token) {
        return {
            success: false,
            message: "Failed to send verification code.",
            data: null,
        };
    }
    const verificationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email-code?code=${token}`;
    const emailVerification: EmailVerification = {
        code,
        email,
        link: verificationUrl,
    };

    try {
        const htmlContent = await renderTemplate(
            templatePath,
            emailVerification
        );
        const mailOptions = {
            from: user,
            to: email,
            subject: "EMAIL VERIFICATION",
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: "Email sent successfully.",
            data: null,
        };
    } catch (error: unknown) {
        console.error(error);
        return {
            success: false,
            message: "Failed to send Email.",
            data: null,
        };
    }
};
