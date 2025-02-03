import { TopicLevel } from "./topicLevel";

export interface NoteTopic {
    id: string;
    content: string;
    topicId: string;
    number: number;
    topic: TopicLevel;
    createdAt: Date;
    updatedAt: Date;
}
