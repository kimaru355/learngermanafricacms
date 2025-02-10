import { Level } from "@/lib/interfaces/levels";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { LevelServices } from "@/lib/interfaces/services/levels";

export class LevelService implements LevelServices {
    async getLevelById(id: string): Promise<ResponseType<Level | null>> {
        try {
            const response: Response = await fetch(`/api/levels/level/${id}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching level",
                    data: null,
                };
            }
            const result: ResponseType<Level> = await response.json();
            return {
                success: true,
                message: "Level fetched",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching level",
                data: null,
            };
        }
    }

    async getLevelByName(name: string): Promise<ResponseType<Level | null>> {
        try {
            const response: Response = await fetch(`/api/levels/name/${name}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching level",
                    data: null,
                };
            }
            const result: ResponseType<Level> = await response.json();
            return {
                success: true,
                message: "Level fetched",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching level",
                data: null,
            };
        }
    }

    async getAllLevels(): Promise<ResponseType<Level[] | null>> {
        try {
            const response: Response = await fetch("/api/levels");
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching levels",
                    data: null,
                };
            }
            const result: ResponseType<Level[]> = await response.json();
            return {
                success: true,
                message: "Levels fetched",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching levels",
                data: null,
            };
        }
    }

    async updateLevel(level: Level): Promise<ResponseType<Level | null>> {
        try {
            const response: Response = await fetch(
                `/api/levels/level/${level.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(level),
                }
            );
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error updating level",
                    data: null,
                };
            }
            const result: ResponseType<Level> = await response.json();
            return {
                success: true,
                message: "Level updated",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error updating level",
                data: null,
            };
        }
    }
}
