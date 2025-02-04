"use client";

import { useToast } from "@/hooks/use-toast";
import { NewTopic } from "@/lib/definitions/newTopicSchema";
import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Topic } from "@/lib/interfaces/topic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

export default function Page() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const newTopic: NewTopic | null =
        topicId === "new" || !topicId
            ? { name: "", description: "", imageUrl: "", levelId: "" }
            : null;
    const [level, setLevel] = useState<Level | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (topicId === "new" || !topicId) {
            console.log("new topic", newTopic);
            return;
        }
        const fetchLevel = async (levelId: string) => {
            try {
                const response = await fetch(`/api/levels/level/${levelId}`);
                if (!response.ok) {
                    toast({
                        title: "Error fetching level",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<Level> = await response.json();
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
                    variant: "destructive",
                });
            }
        };
        const fetchTopic = async () => {
            try {
                const response = await fetch(`/api/topics/topic/${topicId}`);
                if (!response.ok) {
                    toast({
                        title: "Error fetching topic",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<Topic> = await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching topic",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setTopic(result.data);
                fetchLevel(result.data.levelId);
            } catch {
                toast({
                    title: "Error fetching topic",
                    variant: "destructive",
                });
            }
        };
        fetchTopic();
    }, [topicId]);

    return (
        <section>
            <div className="bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end -mt-4 md:-mt-16 pt-8 md:pt-20 pb-10 md:rounded-4xl text-white">
                <div className="mx-auto px-4 md:px-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="font-bold text-4xl text-white">
                            {level?.name}
                        </h1>
                        <p className="bg-[rgba(167,126,250,0.16)] px-4 py-1 rounded-4xl">
                            Level
                        </p>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h3>{topic?.name}</h3>
                            <p className="bg-[rgba(0,212,145,0.16)] px-4 py-1 rounded-4xl">
                                Topic
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Create At:</p>
                            <p className="text-[#00D491]">
                                {topic?.createdAt
                                    ? format(
                                          new Date(topic?.createdAt),
                                          "do MMM yyyy"
                                      )
                                    : ""}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Updated At:</p>
                            <p className="text-[#00D491]">
                                {topic?.updatedAt
                                    ? format(
                                          new Date(topic?.updatedAt),
                                          "do MMM yyyy"
                                      )
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:grid md:grid-cols-5 bg-white my-4">
                <div className="md:col-span-3 p-4">
                    {topic?.imageUrl && (
                        <Image
                            src={topic?.imageUrl || ""}
                            alt={topic?.name || "topic image"}
                            priority={false}
                            width={740}
                            height={500}
                            className="rounded-xl w-[740px] h-[500px] object-cover"
                        />
                    )}
                </div>

                <div className="md:col-span-2 p-4">
                    <h2 className="my-4 font-semibold text-[#000412] text-4xl">
                        Description
                    </h2>
                    <p className="font-normal text-[#4F4528] text-2xl">
                        {topic?.description}
                    </p>
                </div>
            </div>
        </section>
    );
}
