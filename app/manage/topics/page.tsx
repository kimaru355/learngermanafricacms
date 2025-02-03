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
import { Button } from "@/components/ui/button";
import { TopicLevel } from "@/lib/interfaces/topicLevel";

export default function Topics() {
    const [topics, setTopics] = useState<TopicLevel[]>([]);
    const { toast } = useToast();

    const fetchTopics = async () => {
        try {
            const response = await fetch("/api/topics");
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

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <section className="bg-white px-2 py-2 rounded-xl md:rounded-4xl w-full">
            <div className="flex justify-between my-4 w-full text-lg">
                <h2 className="font-semibold text-2xl md:text-3xl">Topics</h2>
                <Button>+ Add Topic</Button>
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
                                <Button className="border-[#000412] bg-white border text-[#000412]">
                                    Edit
                                </Button>
                                <Button className="border-[#FF3C5F] bg-white border text-[#FF3C5F]">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}
