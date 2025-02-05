"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { TopicLevel } from "@/lib/interfaces/topicLevel";
import { useSearchParams } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Page() {
    const [topics, setTopics] = useState<TopicLevel[]>([]);
    const { toast } = useToast();
    const params = useSearchParams();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const levels =
                    params.get("levels") !== ""
                        ? params.get("levels")?.split(" ") || []
                        : [];
                const url =
                    levels.length > 0 ? "/api/topics/levels" : "/api/topics";
                const body =
                    levels.length > 0
                        ? JSON.stringify({ levelNames: levels })
                        : undefined;
                const method = levels.length > 0 ? "PUT" : "GET";
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body,
                });
                if (!response.ok) {
                    toast({
                        title: "Error fetching topics",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<TopicLevel[] | null> =
                    await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching topics",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setTopics(result.data);
            } catch {
                return <div>An Error Occurred</div>;
            }
        };
        fetchTopics();
    }, [params]);

    const deleteTopic = async (topicId: string) => {
        if (!topicId) {
            toast({
                title: "Error deleting topic",
                description: "Invalid topic id",
                variant: "destructive",
            });
        }
        try {
            const response = await fetch(`/api/topics/topic/${topicId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast({
                    title: "Error deleting topic",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<null> = await response.json();
            if (!result.success) {
                toast({
                    title: "Error deleting topic",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Topic deleted successfully",
                variant: "success",
            });
            window.location.reload();
        } catch {
            toast({
                title: "Error deleting topic",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="bg-white px-2 py-2 rounded-xl md:rounded-4xl w-full">
            <div className="flex justify-between my-4 w-full text-lg">
                <h2 className="font-semibold text-2xl md:text-3xl">Topics</h2>
                <Link
                    href={"/topics/update/new"}
                    className="bg-black px-4 py-2 rounded-xl text-center text-white"
                >
                    + Add Topic
                </Link>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-[rgba(167,126,250,0.1)]">
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {topics.map((topic) => (
                        <TableRow key={topic.id}>
                            <TableCell className="text-lg md:text-xl">
                                {topic.level.name}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {topic.name}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(topic.createdAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(topic.updatedAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="flex justify-center space-x-2 md:text-lg">
                                <Link
                                    href={`/topics/update/${topic.id}`}
                                    className="border-[#000412] bg-white py-1 border rounded-xl w-24 text-[#000412] text-center"
                                >
                                    View
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="border-[#FF3C5F] bg-white py-1 border rounded-xl w-24 text-[#FF3C5F]">
                                            Delete
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl md:text-3xl">
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-lg md:text-xl">
                                                This action cannot be undone.
                                                This will permanently delete
                                                this{" "}
                                                <span className="text-red-400">
                                                    topic
                                                </span>{" "}
                                                and{" "}
                                                <span className="text-red-400">
                                                    ALL
                                                </span>{" "}
                                                of it&rsquo;s
                                                <span className="text-red-400">
                                                    {" "}
                                                    notes.
                                                </span>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="text-lg">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-400 hover:bg-red-600 text-lg text-white hover:cursor-pointer"
                                                onClick={() => {
                                                    deleteTopic(topic.id);
                                                }}
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}
