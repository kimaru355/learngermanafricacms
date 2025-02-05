"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
    const [notes, setNotes] = useState<NoteTopic[]>([]);
    const { toast } = useToast();
    const params = useSearchParams();

    const deleteNote = async (noteId: string) => {
        if (!noteId) {
            toast({
                title: "Error deleting note",
                description: "Invalid note id",
                variant: "destructive",
            });
        }
        try {
            const response = await fetch(`/api/notes/note/${noteId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast({
                    title: "Error deleting note",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<null> = await response.json();
            if (!result.success) {
                toast({
                    title: "Error deleting note",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "note deleted successfully",
                variant: "success",
            });
            window.location.reload();
        } catch {
            toast({
                title: "Error deleting note",
                variant: "destructive",
            });
        }
    };

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
                <Link
                    href={"/notes/update/new"}
                    className="bg-black px-4 py-2 rounded-xl text-center text-white"
                >
                    + Add Note
                </Link>
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
                                <Link
                                    href={`/topics/update/${note.id}`}
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
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete
                                                this note and cannot be
                                                recovered.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-400 hover:bg-red-600 text-white hover:cursor-pointer"
                                                onClick={() => {
                                                    deleteNote(note.id);
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
