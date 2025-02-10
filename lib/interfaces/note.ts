import { JsonValue } from "@prisma/client/runtime/library";
import { JSONContent } from "@tiptap/react";

export interface Note {
    id: string;
    content: JSONContent;
    topicId: string;
    number: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface NoteDb {
    id: string;
    content: JsonValue;
    topicId: string;
    number: number;
    createdAt: Date;
    updatedAt: Date;
}
