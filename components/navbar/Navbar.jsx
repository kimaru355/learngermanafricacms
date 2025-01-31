"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        if (!path.startsWith("/auth") && status === "unauthenticated") {
            router.push("/auth/login");
        } else if (path.startsWith("/auth") && status === "authenticated") {
            router.push("/");
        }
    }, [status, path]);

    return (
        <nav className="flex justify-between items-center bg-deep-blue-gradient px-4 lg:px-8 w-full">
            <div>
                <Link href={"/"}>Learn German Africa</Link>
            </div>
            <div>
                {status === "unauthenticated" && (
                    <Link
                        href={"/auth/login"}
                        className="bg-black px-4 py-2 rounded-lg text-white"
                    >
                        Login
                    </Link>
                )}
                {status === "authenticated" && (
                    <div>
                        <Button onClick={signOut}>Logout</Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
