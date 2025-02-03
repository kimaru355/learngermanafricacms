"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopicsFilter() {
    const path = usePathname();
    const searchParams = useSearchParams();
    const [levels, setLevels] = useState<Level[]>([]);
    const { toast } = useToast();
    const router = useRouter();
    const [selectedLevels, setSelectedLevels] = useState(
        searchParams.get("levels")?.split(" ") || []
    );

    useEffect(() => {
        const fetchLevels = async () => {
            const response = await fetch("/api/levels");
            if (!response.ok) {
                toast({
                    title: "Error fetching levels",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<Level[] | null> = await response.json();
            if (!result.success || !result.data) {
                toast({
                    title: "Error fetching levels",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setLevels(result.data);
        };
        fetchLevels();
    }, []);

    const applyFilters = () => {
        if (selectedLevels.length === 0) {
            return;
        }
        const filter = selectedLevels.join("+");
        router.push(`${path}?levels=${filter}`);
    };

    return (
        <div className="my-4">
            <Label className="mt-4 text-[#A3A7B9] text-lg md:text-xl">
                Level
            </Label>
            <div className="my-2">
                {levels.map((level) => (
                    <div key={level.id}>
                        <Checkbox
                            id={level.id}
                            defaultChecked={selectedLevels.includes(level.name)}
                            onCheckedChange={() => {
                                if (selectedLevels.includes(level.name)) {
                                    setSelectedLevels(
                                        selectedLevels.filter(
                                            (name) => name !== level.name
                                        )
                                    );
                                } else {
                                    setSelectedLevels([
                                        ...selectedLevels,
                                        level.name,
                                    ]);
                                }
                            }}
                        />
                        <Label
                            className="mt-4 ml-2 text-black text-lg"
                            htmlFor={level.id}
                        >
                            {level.name}
                        </Label>
                    </div>
                ))}
            </div>
            <Button
                className="bg-blue-500 hover:bg-blue-700 w-40 hover:cursor-pointer"
                onClick={applyFilters}
            >
                Apply
            </Button>
        </div>
    );
}
