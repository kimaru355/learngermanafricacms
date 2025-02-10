import { Level } from "../levels";
import { ResponseType } from "../ResponseType";

export interface LevelServices {
    getLevelByName(name: string): Promise<ResponseType<Level | null>>;
    getLevelById(id: string): Promise<ResponseType<Level | null>>;
    getAllLevels(): Promise<ResponseType<Level[] | null>>;
    updateLevel(level: Level): Promise<ResponseType<Level | null>>;
}
