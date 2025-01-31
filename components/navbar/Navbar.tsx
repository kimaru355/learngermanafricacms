"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UserType } from "@/lib/definitions/userSchema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<null | UserType>(null);
    const router = useRouter();
    const path = usePathname();

    const navLinks: { name: string; link: string }[] = [
        {
            name: "Dashboard",
            link: "/dashboard",
        },
        {
            name: "Manage",
            link: "/manage/levels",
        },
    ];

    useEffect(() => {
        if (!path.startsWith("/auth") && status === "unauthenticated") {
            router.push("/auth/login");
        } else if (path.startsWith("/auth") && status === "authenticated") {
            router.push("/");
        }
        if (session) {
            setUser(session.user);
        }
    }, [status, path]);

    return (
        <nav className="flex justify-between items-center px-4 lg:px-8 pt-2 w-full text-white">
            <div className="flex justify-between items-center bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end px-4 md:px-12 p-4 rounded-4xl w-full">
                <Link
                    href={"/"}
                    className="flex justify-center items-center gap-2"
                >
                    <Image src="/logo.svg" width={50} height={50} alt="logo" />
                    <p className="text-xl">Learn German Africa</p>
                </Link>
                {status === "unauthenticated" && (
                    <Link
                        href={"/auth/login"}
                        className="bg-black px-4 py-2 rounded-lg text-white"
                    >
                        Login
                    </Link>
                )}
                {status === "authenticated" && (
                    <div className="space-x-4">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.link}
                                className={`px-4 py-2 rounded-xl text-lg text-[#D2D5D8] ${
                                    path === link.link ? "bg-[#2F384E]" : ""
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
                {status === "authenticated" && user && (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:cursor-pointer">
                                <div className="flex justify-center items-center bg-[#D2D5D8] rounded-full w-20 h-20 text-black">
                                    <Avatar>
                                        <AvatarImage
                                            src={user.profileImageUrl}
                                            alt="Profile Image"
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(" ")[0]
                                                .split("")[0] || ""}
                                            {user.name
                                                .split(" ")[1]
                                                .split("")[0] || ""}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        signOut();
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </nav>
    );
}
