"use client";

import { useToast } from "@/hooks/use-toast";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Statistics } from "@/lib/interfaces/statistics";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SessionFallback from "../fallback/sessionFallback";
import Image from "next/image";

export default function ManageHero() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [statistics, setStatistics] = useState<Statistics | null>(null);

    useEffect(() => {
        if (!session) {
            return;
        }
        const fetchStatistics = async () => {
            try {
                const response = await fetch("/api/statistics");
                if (!response.ok) {
                    toast({
                        title: "Error fetching statistics",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<Statistics | null> =
                    await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching statistics",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setStatistics(result.data);
            } catch {
                toast({
                    title: "Error fetching statistics",
                    description: "An error occurred.",
                    variant: "destructive",
                });
            }
        };
        fetchStatistics();
    }, [session]);

    if (status === "loading") {
        return <SessionFallback />;
    }

    return (
        <section className="bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end -mt-4 md:-mt-16 pt-8 md:pt-20 pb-10 md:rounded-4xl text-white">
            <div className="mx-auto px-4 md:px-12">
                <h1 className="mb-6 font-bold text-4xl text-white">Metrics</h1>
                <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                    <div className="space-y-4 bg-[rgba(32,39,62,0.87)] opacity-90 px-4 md:px-8 py-2 rounded-2xl w-full md:w-96">
                        <h3 className="text-2xl">Levels</h3>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-4xl md:text-5xl">
                                {statistics?.levelsCount}
                            </p>
                            <div className="flex justify-center items-center bg-[#523F78] rounded-full w-16 h-16">
                                <Image
                                    src={"/icons/chart.svg"}
                                    alt="Levels"
                                    height={40}
                                    width={40}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 bg-[rgba(32,39,62,0.87)] opacity-90 px-4 md:px-8 py-2 rounded-2xl w-full md:w-96">
                        <h3 className="text-2xl">Topics</h3>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-4xl md:text-5xl">
                                {statistics?.topicsCount}
                            </p>
                            <div className="flex justify-center items-center bg-[#134E3B] rounded-full w-16 h-16">
                                <Image
                                    src={"/icons/notes.svg"}
                                    alt="Levels"
                                    height={40}
                                    width={40}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 bg-[rgba(32,39,62,0.87)] opacity-95 px-4 md:px-8 py-2 rounded-2xl w-full md:w-96">
                        <h3 className="text-2xl">Notes</h3>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-4xl md:text-5xl">
                                {statistics?.notesCount}
                            </p>
                            <div className="flex justify-center items-center bg-[#4F4528] rounded-full w-16 h-16">
                                <Image
                                    src={"/icons/edit.svg"}
                                    alt="Levels"
                                    height={40}
                                    width={40}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
