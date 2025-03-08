"use client";

import { useToast } from "@/hooks/use-toast";
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import CreateNote from "@/components/notes/createNote";
import Questions from "@/components/notes/Questions";

export default function Page() {
    const { id } = useParams() as { id: string };
    const [oldNote, setOldNote] = useState<NoteTopic | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (id === "new") {
            return;
        }
        const fetchNote = async () => {
            try {
                const response: Response = await fetch(
                    `/api/notes/note/${id}/details`
                );
                if (!response.ok) {
                    toast({
                        title: "Error fetching level",
                        variant: "destructive",
                    });
                    return;
                }
                const result: ResponseType<NoteTopic | null> =
                    await response.json();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching level",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setOldNote(result.data);
            } catch {
                toast({
                    title: "Error fetching level",
                    variant: "destructive",
                });
            }
        };
        fetchNote();
    }, []);

    return (
        <main className="w-full">
            <div className="bg-linear-to-r from-deep-blue-gradient-start to-deep-blue-gradient-end -mt-4 md:-mt-16 pt-8 md:pt-20 pb-10 md:rounded-4xl text-white">
                <div className="mx-auto px-4 md:px-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="font-bold text-white text-4xl">
                            {oldNote?.topic.level.name}
                        </h1>
                        <p className="bg-[rgba(167,126,250,0.16)] px-4 py-1 rounded-4xl">
                            Level
                        </p>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h3>{oldNote?.topic.name}</h3>
                            <p className="bg-[rgba(0,212,145,0.16)] px-4 py-1 rounded-4xl">
                                Topic
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Note Number:</p>
                            <p className="text-[#00D491]">{oldNote?.number}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Updated At:</p>
                            <p className="text-[#00D491]">
                                {oldNote?.updatedAt
                                    ? format(
                                          new Date(oldNote?.updatedAt),
                                          "do MMM yyyy"
                                      )
                                    : ""}
                            </p>
                        </div>
                    </div>
                    <div className="my-2">
                        <CreateNote id={id} oldNote={oldNote} />
                    </div>
                </div>
            </div>
            <div>{oldNote && <RichTextEditor oldNote={oldNote} />}</div>
            <div>{oldNote && <Questions noteId={id} />}</div>
        </main>
    );
}
