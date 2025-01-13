import { Level } from "../levels";
import { ResponseType } from "../ResponseType";

export interface LevelServices {
    getLevel(name: string): Promise<ResponseType<Level | null>>;
    getAllLevels(): Promise<ResponseType<Level[] | null>>;
    updateLevel(level: Level): Promise<ResponseType<Level | null>>;
    createLevel(level: Level): Promise<ResponseType<Level | null>>;
    deleteLevel(name: string): Promise<ResponseType<boolean>>;
}
