"use client";

import { JSONContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { MenuBar } from "./components/MenuBar";
import { Content } from "./components/EditorContent";
import Preview from "./Preview";
import { NoteTopic } from "@/lib/interfaces/noteTopic";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { NoteService } from "@/services/noteService";
import _ from "lodash";

export const RichTextEditor = ({ oldNote }: { oldNote: NoteTopic }) => {
    const editor = useEditor({
        extensions,
        immediatelyRender: false,
        content:
            Object.keys(oldNote.content).length === 0 ? "" : oldNote.content,
        editorProps: {
            attributes: {
                class: "min-h-[200px] outline outline-1 outline-gray-400 focus:outline-gray-400 p-2",
                placeholder: "Start typing...",
            },
        },
    });
    const { toast } = useToast();

    const saveContent = async () => {
        const content: JSONContent | undefined = editor?.getJSON();
        if (!content) {
            toast({
                title: "Add some content first",
                variant: "destructive",
            });
            return;
        }
        if (_.isEqual(content, oldNote.content)) {
            toast({
                title: "No changes have been made",
                variant: "destructive",
            });
            return;
        }
        const noteService = new NoteService();
        const result = await noteService.updateNote({
            id: oldNote.id,
            number: oldNote.number,
            topicId: oldNote.topicId,
            content: content,
            createdAt: oldNote.createdAt,
            updatedAt: oldNote.updatedAt,
        });
        if (!result.success || !result.data) {
            toast({
                title: "Error saving content",
                variant: "destructive",
            });
            return;
        }
        oldNote.content = result.data.content;
        toast({
            title: "Content saved successfully",
            variant: "success",
        });
    };

    return (
        <section className="flex lg:flex-row flex-col gap-4 m-2 w-full">
            <div className="mx-auto my-8 w-full lg:w-1/2 max-w-4xl">
                <MenuBar editor={editor} />
                <Content editor={editor} />
                <div className="flex justify-end my-2">
                    <Button
                        className="bg-green-500 hover:bg-green-700 w-28 text-xl hover:cursor-pointer"
                        onClick={() => {
                            saveContent();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <div className="w-full lg:w-1/2 max-w-full">
                <Preview content={editor?.getHTML() || ""} />
            </div>
        </section>
    );
};
