import NEXTAUTH, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/utils/prisma";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials?: Record<string, string | undefined>) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: email },
                });

                if (!user || !user?.password) return null;

                const isValid = await compare(password, user.password);
                if (isValid) {
                    //Edit the user lastLogin  DateTime?
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            lastLogin: new Date(),
                        },
                    });

                    // fetch the user and return all the fields except the password
                    return {
                        id: user.id,
                        email: user.email,
                        isEmailVerified: user.isEmailVerified,
                        providerUserId: user.providerUserId,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        level: user.level,
                        profileImageUrl: user.profileImageUrl,
                        role: user.role,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
        verifyRequest: "/auth/verify-email",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({
            token,
            user,
            trigger,
            session,
        }: {
            token: JWT;
            user?: User | AdapterUser;
            trigger?: "signIn" | "signUp" | "update";
            session?: Session;
        }): Promise<JWT> {
            if (user) {
                // Cast the user to your custom UserType if necessary
                const customUser = user as {
                    id: string;
                    email: string;
                    isEmailVerified: boolean;
                    name: string;
                    phoneNumber?: string;
                    level: string;
                    profileImageUrl?: string;
                    role: string;
                    providerUserId?: string;
                };

                token.id = customUser.id;
                token.email = customUser.email;
                token.isEmailVerified = customUser.isEmailVerified;
                token.providerUserId = customUser.providerUserId;
                token.name = customUser.name;
                token.phoneNumber = customUser.phoneNumber;
                token.level = customUser.level;
                token.profileImageUrl = customUser.profileImageUrl;
                token.role = customUser.role;
            }

            if (trigger === "update" && session?.user) {
                return { ...token, ...session.user };
            }

            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Session;
            token: JWT;
        }): Promise<Session> {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.emailVerified = token.isEmailVerified;
            session.user.providerUserId = token.providerUserId;
            session.user.name = token.name;
            session.user.phoneNumber = token.phoneNumber;
            session.user.level = token.level;
            session.user.image = token.profileImageUrl; // Corrected key
            session.user.role = token.role;
            return session;
        },
    },
    events: {
        async signOut(message: {
            sessionToken?: string;
            token?: JWT;
        }): Promise<void> {
            const { token } = message;

            if (token) {
                // Update the user's last logout timestamp in the database
                await prisma.user.update({
                    where: { id: token.id },
                    data: {
                        lastLogout: new Date().toISOString(),
                    },
                });
            }
        },
    },
};

const handler = NEXTAUTH(authOptions);

export { handler as GET, handler as POST };
