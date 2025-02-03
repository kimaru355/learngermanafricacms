"use client";

import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LevelCard from "@/components/manage/levels/levelCard";

export default function Page() {
    const [levels, setLevels] = useState<Level[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await fetch("/api/levels");
                if (!response.ok) {
                    toast({
                        title: "Error fetching levels",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<Level[] | null> =
                    await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching levels",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setLevels(result.data);
            } catch {
                toast({
                    title: "Error fetching levels",
                    description: "An error occurred.",
                    variant: "destructive",
                });
                return;
            }
        };

        fetchLevels();
    }, []);

    return (
        <section className="flex flex-wrap gap-4">
            {levels.map((level) => (
                <div key={level.id}>
                    <LevelCard level={level} />
                </div>
            ))}
        </section>
    );
}
