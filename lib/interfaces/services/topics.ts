import { ResponseType } from "../ResponseType";
import { Topic } from "../topic";

export interface TopicsServices {
    getTopic(name: string): Promise<ResponseType<Topic | null>>;
    getAllTopics(): Promise<ResponseType<Topic[] | null>>;
    getTopicsByLevel(level: string): Promise<ResponseType<Topic[] | null>>;
    createTopic(topic: Topic): Promise<ResponseType<Topic | null>>;
    updateTopic(topic: Topic): Promise<ResponseType<Topic | null>>;
    deleteTopic(id: string): Promise<ResponseType<boolean>>;
}
