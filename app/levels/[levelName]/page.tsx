"use client";

import { useToast } from "@/hooks/use-toast";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({
    params,
}: {
    params: Promise<{ levelName: string }>;
}) {
    const { toast } = useToast();
    const [level, setLevel] = useState<Level | null>(null);

    const fetchLevel = async () => {
        try {
            const { levelName } = await params;
            if (!levelName) {
                toast({
                    title: "Invalid level name",
                    variant: "destructive",
                });
                return;
            }
            const response = await fetch(`/api/levels/${levelName}`);
            if (!response.ok) {
                toast({
                    title: "Error fetching level",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<Level | null> = await response.json();
            if (!result.success || !result.data) {
                toast({
                    title: "Error fetching level",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setLevel(result.data);
        } catch {
            toast({
                title: "Error fetching level",
                description: "An error occurred.",
                variant: "destructive",
            });
            return;
        }
    };

    useEffect(() => {
        fetchLevel();
    }, []);

    return (
        <section>
            {level && (
                <div>
                    <Image
                        src={level.imageUrl}
                        alt={level.name}
                        width={740}
                        height={500}
                    />
                    <h1>{level.name}</h1>
                    <p>{level.description}</p>
                </div>
            )}
        </section>
    );
}
