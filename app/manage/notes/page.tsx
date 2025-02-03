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
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const [notes, setNotes] = useState<NoteTopic[]>([]);
    const { toast } = useToast();
    const params = useSearchParams();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const levels =
                    params.get("levels") !== ""
                        ? params.get("levels")?.split(" ") || []
                        : [];
                const url =
                    levels.length > 0
                        ? "/api/notes/levels"
                        : "/api/notes/topic";
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
                        title: "Error fetching notes",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<NoteTopic[] | null> =
                    await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching notes",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setNotes(result.data);
            } catch {
                return <div>An Error Occurred</div>;
            }
        };
        fetchNotes();
    }, [params]);

    return (
        <section className="bg-white px-2 py-2 rounded-xl md:rounded-4xl w-full">
            <div className="flex justify-between my-4 w-full text-lg">
                <h2 className="font-semibold text-2xl md:text-3xl">Notes</h2>
                <Button>+ Add Note</Button>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-[rgba(167,126,250,0.1)]">
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {notes.map((note) => (
                        <TableRow key={note.id}>
                            <TableCell className="text-lg md:text-xl">
                                {note.topic.level.name}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {note.topic.name}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {note.number}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(note.createdAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(note.updatedAt),
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
