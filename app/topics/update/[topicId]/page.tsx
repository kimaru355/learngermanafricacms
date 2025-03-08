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
import { CldUploadWidget } from "next-cloudinary";
import UpdateTopic from "@/components/manage/topics/createTopic";
import Notes from "@/components/topics/Notes";

export default function Page() {
    const { topicId } = useParams() as { topicId: string };
    const [topic, setTopic] = useState<NewTopic>({
        name: "",
        description: "",
        imageUrl: "",
        levelId: "",
    });
    const [oldTopic, setOldTopic] = useState<Topic | null>(null);
    const [level, setLevel] = useState<Level | null>(null);
    const { toast } = useToast();

    const handleImageUpload = async (imageUrl: string) => {
        try {
            if (!imageUrl) {
                toast({
                    title: "Image Upload Failed",
                    description: "Please try again",
                    variant: "destructive",
                });
                return;
            }
            if (!topicId || topicId === "new") {
                setTopic((prevTopic) => {
                    return {
                        ...prevTopic,
                        imageUrl,
                    };
                });
                toast({
                    title: "Image uploaded successfully, proceed to create topic",
                    variant: "success",
                });
                return;
            }
            const response = await fetch(`/api/topics/topic/${topicId}/image`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageUrl }),
            });
            if (!response.ok) {
                toast({
                    title: "Image Upload Failed",
                    description: "Please try again",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<Topic> = await response.json();
            if (!result.success || !result.data) {
                toast({
                    title: "Image Upload Failed",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setTopic({
                name: result.data.name,
                description: result.data.description,
                imageUrl: result.data.imageUrl,
                levelId: result.data.levelId,
            });
            setOldTopic(result.data);
            toast({
                title: "Image uploaded successfully",
                variant: "success",
            });
        } catch {
            toast({
                title: "Image Upload Failed",
                description: "Please try again",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (!topicId || topicId === "new") {
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
                setOldTopic(result.data);
                setTopic({
                    name: result.data.name,
                    description: result.data.description,
                    imageUrl: result.data.imageUrl,
                    levelId: result.data.levelId,
                });
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
        <main>
            <div className="bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end -mt-4 md:-mt-16 pt-8 md:pt-20 pb-10 md:rounded-4xl text-white">
                <div className="mx-auto px-4 md:px-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="font-bold text-white text-4xl">
                            {level?.name}
                        </h1>
                        <p className="bg-[rgba(167,126,250,0.16)] px-4 py-1 rounded-4xl">
                            Level
                        </p>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h3>{topic.name}</h3>
                            <p className="bg-[rgba(0,212,145,0.16)] px-4 py-1 rounded-4xl">
                                Topic
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Create At:</p>
                            <p className="text-[#00D491]">
                                {oldTopic?.createdAt
                                    ? format(
                                          new Date(oldTopic?.createdAt),
                                          "do MMM yyyy"
                                      )
                                    : ""}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Updated At:</p>
                            <p className="text-[#00D491]">
                                {oldTopic?.updatedAt
                                    ? format(
                                          new Date(oldTopic?.updatedAt),
                                          "do MMM yyyy"
                                      )
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:grid md:grid-cols-5 bg-white m-4 md:mx-0">
                <div className="relative md:col-span-2 bg-black/16 rounded-xl h-[500px]">
                    {topic.imageUrl && (
                        <Image
                            src={topic.imageUrl}
                            alt={topic.name || "topic image"}
                            priority={false}
                            width={740}
                            height={500}
                            className="rounded-xl w-[740px] h-[500px] object-cover"
                        />
                    )}

                    <CldUploadWidget
                        uploadPreset="learn_german_africa_unsigned"
                        options={{
                            sources: ["local"], // Allow uploads from device
                            resourceType: "image", // Restrict to images only
                            maxFiles: 1, // Allow only one file per upload
                        }}
                        onSuccess={(result) => {
                            if (
                                !result.info ||
                                typeof result.info === "string" ||
                                !result.info.secure_url
                            ) {
                                return;
                            }
                            handleImageUpload(result.info.secure_url);
                        }}
                    >
                        {({ open }) => {
                            return (
                                <button
                                    onClick={() => {
                                        open();
                                    }}
                                    className="right-8 bottom-8 absolute flex justify-center items-center bg-white hover:bg-[#0078ff] shadow-2xl rounded-full size-16 hover:cursor-pointer"
                                >
                                    <Image
                                        src="/icons/edit-pencil.svg"
                                        alt="edit image"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                </div>

                <div className="md:col-span-3 p-4">
                    <h2 className="my-4 font-semibold text-[#000412] text-4xl">
                        Description
                    </h2>
                    <p className="font-normal text-[#4F4528] text-2xl">
                        {topic.description}
                    </p>
                    <UpdateTopic topic={topic} topicId={topicId} />
                </div>
            </div>
            <div className="my-8">
                <Notes topicId={topicId} topic={oldTopic} level={level} />
            </div>
        </main>
    );
}
