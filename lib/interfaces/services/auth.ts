import { ResponseType } from "../ResponseType";

export default interface AuthServices {
    sendEmailVerification(email: string): Promise<ResponseType<null>>;
    verifyEmail(email: string, code: string): Promise<ResponseType<null>>;
    verifyEmailCode(code: string): Promise<ResponseType<null>>;
}
