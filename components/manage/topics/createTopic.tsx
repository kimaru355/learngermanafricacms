"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRightIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NewTopic } from "@/lib/definitions/newTopicSchema";
import { Level } from "@/lib/interfaces/levels";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Topic } from "@/lib/interfaces/topic";
import { useRouter } from "next/navigation";

export default function UpdateTopic({
    topic,
    topicId,
}: {
    topic: NewTopic;
    topicId: string;
}) {
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [levels, setLevels] = useState<Level[]>([]);
    const router = useRouter();

    const getData = (): NewTopic | boolean => {
        if (!nameRef.current || !descriptionRef.current) {
            return false;
        }
        const levelId: string = topic.levelId;
        const name: string = nameRef.current.value;
        const description: string = descriptionRef.current.value;
        const imageUrl: string = topic.imageUrl;
        if (!imageUrl) {
            toast({
                title: "Please upload an image first",
                variant: "destructive",
            });
            return false;
        }
        if (!name || !description || !levelId) {
            toast({
                title: "Please fill in all fields",
                variant: "destructive",
            });
            return false;
        }
        return {
            name,
            description,
            imageUrl,
            levelId,
        };
    };

    const updateTopic = async () => {
        const newTopic: NewTopic | boolean = getData();
        if (!newTopic) {
            return;
        }
        const url =
            topicId === "new" ? "/api/topics" : `/api/topics/topic/${topicId}`;
        const method = topicId === "new" ? "POST" : "PUT";
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTopic),
            });
            if (!response.ok) {
                toast({
                    title:
                        topicId === "new"
                            ? "Failed to create topic"
                            : "Failed to update topic",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<Topic | null> = await response.json();
            if (!result.success || !result.data) {
                toast({
                    title:
                        topicId === "new"
                            ? "Failed to create topic"
                            : "Failed to update topic",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title:
                    topicId === "new"
                        ? "Topic created successfully"
                        : "Topic updated successfully",
                variant: "success",
            });
            setOpen(false);
            if (topicId === "new") {
                router.push(`/topics/update/${result.data.id}`);
            } else {
                window.location.reload();
            }
        } catch {
            toast({
                title:
                    topicId === "new"
                        ? "Failed to create topic"
                        : "Failed to update topic",
                variant: "destructive",
            });
        }
    };

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
                const result: ResponseType<Level[]> = await response.json();
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
                    variant: "destructive",
                });
            }
        };
        fetchLevels();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-white hover:bg-black/10 py-2 border border-black rounded-xl w-full text-black text-center">
                {topicId === "new" ? "Create" : "Edit"} Topic
                <ArrowUpRightIcon className="inline" />
            </DialogTrigger>
            <DialogContent className="md:max-w-[50rem]">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl md:text-4xl">
                        Topic
                    </DialogTitle>
                    <DialogDescription className="text-xl">
                        Edit the topic. Save when done.
                    </DialogDescription>
                </DialogHeader>
                <Label className="text-lg" htmlFor="level">
                    Level
                </Label>
                <Select
                    onValueChange={(value) => {
                        topic.levelId = value;
                    }}
                >
                    <SelectTrigger className="text-lg md:text-xl outline outline-gray-300">
                        <SelectValue
                            placeholder={
                                levels.find(
                                    (level) => level.id === topic.levelId
                                )?.name || "Choose a level"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem
                                key={level.id}
                                value={level.id}
                                className="text-lg md:text-xl"
                            >
                                {level.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label className="text-lg" htmlFor="name">
                    Name
                </Label>
                <Input
                    className="text-lg md:text-xl outline outline-gray-300"
                    name="name"
                    defaultValue={topic.name}
                    type="text"
                    ref={nameRef}
                />
                <Label className="text-lg" htmlFor="description">
                    Description
                </Label>
                <Textarea
                    rows={8}
                    name="description"
                    ref={descriptionRef}
                    defaultValue={topic.description}
                    className="text-lg md:text-2xl outline outline-gray-300"
                />
                <DialogFooter>
                    <Button
                        onClick={() => {
                            updateTopic();
                        }}
                    >
                        {topicId === "new" ? "Create" : "Update"} Topic
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
