import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { ResponseType } from "../interfaces/ResponseType";
import { EmailVerification } from "../interfaces/emailVerification";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
    email: string
): Promise<ResponseType<null>> => {
    const templatePath = path.join(
        process.cwd(),
        "templates",
        "mailer",
        "verifyEmail.ejs"
    );
    const secret = process.env.NEXTAUTH_SECRET as string;
    const code = jwt.sign({ email }, secret, { expiresIn: "1h" });
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?email=${email}&code=${code}`;
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
            from: process.env.EMAIL_USER,
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
