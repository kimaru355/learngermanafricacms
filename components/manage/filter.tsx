"use client";

import { usePathname, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import NotesFilter from "./notes/notesFilter";
import TopicsFilter from "./topics/topicsFilter";

export default function ManageFilter() {
    const path = usePathname();
    const router = useRouter();

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
        <section className="bg-white px-8 py-6 rounded-3xl w-full md:max-w-96">
            <h2 className="mb-2 font-semibold text-2xl md:text-3xl">Filters</h2>

            <Label className="text-[#A3A7B9] text-[20px]">Resources</Label>
            <RadioGroup
                onValueChange={(value) => {
                    router.push(value);
                }}
                defaultValue={path}
                className="py-4"
            >
                {navLinks.map((link) => (
                    <div
                        key={link.link}
                        className="flex items-center space-x-2"
                    >
                        <RadioGroupItem value={link.link} id={link.name} />
                        <Label htmlFor={link.name} className="text-lg">
                            {link.name}
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <Label className="mt-4 text-[#A3A7B9] text-[20px]">Filter by</Label>
            {/* Topics Filter */}
            {path === "/manage/topics" && <TopicsFilter />}
            {/* Topics Filter */}
            {path === "/manage/notes" && <NotesFilter />}
        </section>
    );
}
