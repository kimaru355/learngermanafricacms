import { Level } from "./levels";

export interface TopicLevel {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    levelId: string;
    createdAt: Date;
    updatedAt: Date;
    level: Level;
}
