"use client";

import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageFilter() {
    const path = usePathname();

    const navLinks: { name: string; link: string }[] = [
        {
            name: "Levels",
            link: "/manage/levels",
        },
        {
            name: "Topics",
            link: "/manage/topics",
        },
        {
            name: "Notes",
            link: "/manage/notes",
        },
    ];

    return (
        <section>
            <h2>Filters</h2>

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button>
                            <span>
                                {navLinks.map((link) => {
                                    if (path === link.link) {
                                        return link.name;
                                    }
                                })}
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent>
                        {navLinks.map((navLink) => (
                            <DropdownMenuItem
                                key={navLink.link}
                                className={`${
                                    path === navLink.link
                                        ? "text-blue-500"
                                        : "text-gray-900"
                                }`}
                                onClick={() => {
                                    router.push(navLink.link);
                                }}
                            >
                                {navLink.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent> */}
                </DropdownMenu>
            </div>
        </section>
    );
}
