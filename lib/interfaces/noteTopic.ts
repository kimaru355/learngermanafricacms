import { JSONContent } from "@tiptap/react";
import { TopicLevel } from "./topicLevel";
import { JsonValue } from "@prisma/client/runtime/library";

export interface NoteTopic {
    id: string;
    content: JSONContent;
    topicId: string;
    number: number;
    topic: TopicLevel;
    createdAt: Date;
    updatedAt: Date;
}

export interface NoteTopicDb {
    id: string;
    content: JsonValue;
    topicId: string;
    number: number;
    topic: TopicLevel;
    createdAt: Date;
    updatedAt: Date;
}
