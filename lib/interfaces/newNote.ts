import { JSONContent } from "@tiptap/react";

export type NewNote = {
    content: JSONContent;
    topicId: string;
    number: number;
};
