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

    const manageLinks: { name: string; link: string }[] = [
        {
            name: "Dashboard",
            link: "/dashboard",
        },
        {
            name: "Content",
            link: "/content/levels",
        },
    ];

    const profileLinks: { name: string; link: string }[] = [
        {
            name: "Profile",
            link: "/profile",
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
        <nav className="top-0 z-40 fixed flex justify-between items-center md:px-4 lg:px-8 md:pt-2 w-full text-white">
            <div className="flex justify-between items-center bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end px-4 md:px-12 p-4 md:rounded-4xl w-full">
                <Link
                    href={"/dashboard"}
                    className="flex justify-center items-center gap-2"
                >
                    <Image src="/logo.svg" width={50} height={50} alt="logo" />
                    <p className="text-xs md:text-xl">Learn German Africa</p>
                </Link>
                {status === "unauthenticated" && (
                    <Link
                        href={"/auth/login"}
                        className="bg-black px-4 py-2 rounded-lg text-white"
                    >
                        Login
                    </Link>
                )}
                {/* Desktop Manage Menu */}
                {status === "authenticated" && (
                    <div className="md:block space-x-4 hidden">
                        {manageLinks.map((link, index) => (
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
                {/* Mobile Menu */}
                {status === "authenticated" && (
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Manage</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {manageLinks.map((link, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => {
                                            router.push(link.link);
                                        }}
                                        className={`${
                                            path === link.link
                                                ? "text-[#D2D5D8] bg-[#2F384E] w-full"
                                                : "text-black "
                                        }`}
                                    >
                                        {link.name}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {profileLinks.map((link, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => {
                                            router.push(link.link);
                                        }}
                                        className={`${
                                            path === link.link
                                                ? "text-[#D2D5D8] bg-[#2F384E] w-full"
                                                : "text-black "
                                        }`}
                                    >
                                        <Link href={link.link}>
                                            {link.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
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
                {/* Desktop Profile Menu */}
                {status === "authenticated" && user && (
                    <div className="md:block hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:cursor-pointer">
                                <div className="flex justify-center items-center rounded-full">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage
                                            src={user.profileImageUrl}
                                            alt="Profile Image"
                                        />
                                        <AvatarFallback className="bg-[#D2D5D8] font-bold text-2xl text-black">
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
                                <DropdownMenuLabel className="text-lg">
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {profileLinks.map((link, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => {
                                            router.push(link.link);
                                        }}
                                        className={`text-lg ${
                                            path === link.link
                                                ? "text-[#D2D5D8] bg-[#2F384E] w-full"
                                                : "text-black "
                                        }`}
                                    >
                                        <Link
                                            href={link.link}
                                            className={`${
                                                path === link.link
                                                    ? "text-[#D2D5D8] bg-[#2F384E] w-full"
                                                    : "text-black "
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        signOut();
                                    }}
                                    className="text-lg"
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
