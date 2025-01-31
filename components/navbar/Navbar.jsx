"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
        <nav
            className="relative flex justify-between items-center bg-white shadow-sm px-4 lg:px-8 h-16 font-mono text-black"
            role="navigation"
        >
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
                    <Button onClick={signOut}>Logout</Button>
                )}
            </div>
        </nav>
    );
}
