import NextAuth, {
    Account,
    AuthOptions,
    Profile,
    Session,
    User,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, {
    CredentialInput,
} from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/utils/prisma";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

const authOptions: AuthOptions = {
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
                if (!email || !password) {
                    throw new Error("/auth/login?error=missing-credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: email },
                });

                if (!user) {
                    throw new Error(
                        "/auth/login?error=invalid-email-or-password"
                    );
                }

                if (!user?.password) {
                    throw new Error("/auth/login?error=no-password-set");
                }

                const isValid = await compare(password, user.password);
                if (!isValid) {
                    throw new Error(
                        "/auth/login?error=invalid-email-or-password"
                    );
                }
                try {
                    //Edit the user lastLogin  DateTime?
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            lastLogin: new Date(),
                        },
                    });
                } catch {
                    throw new Error(
                        "/auth/login?error=failed-to-update-last-login"
                    );
                }

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
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async signIn(params: {
            user: User | AdapterUser;
            account: Account | null;
            profile?: Profile | undefined;
            email?: { verificationRequest?: boolean | undefined } | undefined;
            credentials?: Record<string, CredentialInput> | undefined;
        }) {
            const { user, account, profile } = params;
            if (account?.provider === "credentials") {
                return true;
            }
            if (account?.provider === "google") {
                try {
                    if (!profile || !profile.email || !profile.name)
                        return false;
                    const email = profile.email;
                    const existingUser = await prisma.user.findUnique({
                        where: { email: email },
                    });

                    if (!existingUser) {
                        return "/auth/login?error=invalid-email-or-password";
                    }

                    // Update the user's last login timestamp in the database
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            lastLogin: new Date(),
                            name: profile.name,
                            profileImageUrl: profile.image || null,
                            providerUserId: user.id,
                            isEmailVerified: true,
                        },
                    });
                    return true;
                } catch {
                    return false;
                }
            }
            return false;
        },
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
                const customUser: JWT = user as JWT;

                if (user.name && user.email && !token.providerUserId) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });
                    if (!existingUser) {
                        return token;
                    }
                    customUser.id = existingUser.id;
                    customUser.email = existingUser.email;
                    customUser.isEmailVerified = existingUser.isEmailVerified;
                    if (existingUser.providerUserId) {
                        customUser.providerUserId = existingUser.providerUserId;
                    }
                    customUser.name = existingUser.name;
                    if (existingUser.phoneNumber) {
                        customUser.phoneNumber = existingUser.phoneNumber;
                    }
                    customUser.level = existingUser.level;
                    if (existingUser.profileImageUrl) {
                        customUser.profileImageUrl =
                            existingUser.profileImageUrl;
                    }
                    customUser.role = existingUser.role;
                }

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
