import { Level } from "./levels";

export interface TopicLevel {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    levelId: string;
    createdAt: string;
    updatedAt: string;
    level: Level;
}
