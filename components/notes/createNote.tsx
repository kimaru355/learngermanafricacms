"use client";

import { ArrowUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Level } from "@/lib/interfaces/levels";
import { LevelService } from "@/services/levelService";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Topic } from "@/lib/interfaces/topic";
import { TopicService } from "@/services/topicService";
import { Note } from "@/lib/interfaces/note";
import { NoteService } from "@/services/noteService";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { NewNote } from "@/lib/interfaces/newNote";
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { useRouter } from "next/navigation";

export default function CreateNote({
    id,
    oldNote,
}: {
    id: string;
    oldNote: NoteTopic | null;
}) {
    const [open, setOpen] = useState(false);
    const [levels, setLevels] = useState<Level[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topicNotes, setTopicNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState<NewNote>({
        number: 1,
        topicId: "",
        content: {},
    });
    const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const saveNote = async () => {
        if (!newNote.topicId || !newNote.number) {
            toast({
                title: "Please select a topic and choose note number",
                variant: "destructive",
            });
            return;
        }
        if (
            newNote.number === oldNote?.number &&
            newNote.topicId === oldNote.topicId
        ) {
            toast({
                title: "No changes have been made",
                variant: "destructive",
            });
            return;
        }
        const noteService = new NoteService();
        const result =
            id === "new"
                ? await noteService.createNote(newNote)
                : await noteService.updateNote({
                      id,
                      ...newNote,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                  });
        if (!result.success || !result.data) {
            toast({
                title: "Error saving note",
                description: result.message,
                variant: "destructive",
            });
            return;
        }
        toast({
            title:
                id === "new"
                    ? "Note created successfully"
                    : "Note updated successfully",
            variant: "success",
        });
        if (id === "new") {
            router.push("/notes/update/" + result.data?.id);
        }
        setTimeout(() => {
            if (id !== "new") {
                window.location.reload();
            }
        }, 3000);
    };

    const fetchTopicNotes = async (topicId: string) => {
        const noteService = new NoteService();
        const result = await noteService.getNotesByTopicId(topicId);
        if (!result.success || !result.data) {
            toast({
                title: "Error fetching notes",
                description: result.message,
                variant: "destructive",
            });
            return;
        }
        setTopicNotes(result.data);
    };

    useEffect(() => {
        const fetchLevels = async () => {
            const levelService = new LevelService();
            const result: ResponseType<Level[] | null> =
                await levelService.getAllLevels();
            if (!result.success || !result.data) {
                toast({
                    title: "Error fetching levels",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setLevels(result.data);
        };
        const fetchTopics = async () => {
            const topicService = new TopicService();
            const result: ResponseType<Topic[] | null> =
                await topicService.getAllTopics();
            if (!result.success || !result.data) {
                toast({
                    title: "Error fetching topics",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setTopics(result.data);
        };
        fetchLevels();
        fetchTopics();
    }, []);

    useEffect(() => {
        if (oldNote) {
            setSelectedLevelId(oldNote.topic.levelId);
            setNewNote({
                content: oldNote.content,
                topicId: oldNote.topicId,
                number: oldNote.number,
            });
            fetchTopicNotes(oldNote.topicId);
        }
    }, [oldNote]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-white hover:bg-neutral-300 py-2 border border-black rounded-xl w-full text-black text-center">
                {id === "new" ? "Create" : "Update"} Note Details
                <ArrowUpIcon className="inline" />
            </DialogTrigger>
            <DialogContent className="md:max-w-[50rem]">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl md:text-4xl">
                        Note Details
                    </DialogTitle>
                    <DialogDescription>
                        Edit the details. Save when done.
                    </DialogDescription>
                </DialogHeader>

                <Label className="text-gray-500 md:text-lg">Level</Label>
                <Select
                    onValueChange={(value) => {
                        setSelectedLevelId(value);
                        setNewNote((prevNote) => {
                            return {
                                ...prevNote,
                                topicId: "",
                            };
                        });
                    }}
                    defaultValue={
                        levels.find((level) => level.id === selectedLevelId)?.id
                    }
                >
                    <SelectTrigger className="text-lg md:text-xl outline outline-gray-300">
                        <SelectValue placeholder={"Choose a level"} />
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

                <Label className="text-gray-500 md:text-lg">Topic</Label>
                <Select
                    onValueChange={(value) => {
                        setNewNote((prevNote) => {
                            return {
                                ...prevNote,
                                topicId: value,
                            };
                        });
                        fetchTopicNotes(value);
                    }}
                    defaultValue={
                        topics.find((topic) => topic.id === oldNote?.topicId)
                            ?.id
                    }
                >
                    <SelectTrigger className="text-lg md:text-xl outline outline-gray-300">
                        <SelectValue placeholder={"Choose a topic"} />
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map((topic) => {
                            if (selectedLevelId !== topic.levelId) return;
                            return (
                                <SelectItem
                                    key={topic.id}
                                    value={topic.id}
                                    className="text-lg md:text-xl"
                                >
                                    {topic.name}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                <Label className="text-gray-500 md:text-lg">Number</Label>
                <Input
                    type="number"
                    defaultValue={
                        id === "new" ? topicNotes.length + 1 : oldNote?.number
                    }
                    onChange={(e) => {
                        setNewNote((prevNote) => {
                            return {
                                ...prevNote,
                                number: +e.target.value,
                            };
                        });
                    }}
                />
                <DialogFooter>
                    <Button onClick={saveNote}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
