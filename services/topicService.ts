import { ResponseType } from "@/lib/interfaces/ResponseType";
import { TopicsServices } from "@/lib/interfaces/services/topics";
import { Topic } from "@/lib/interfaces/topic";

export class TopicService implements TopicsServices {
    async getTopic(id: string): Promise<ResponseType<Topic | null>> {
        try {
            const response: Response = await fetch(`/api/topics/topic/${id}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching topic",
                    data: null,
                };
            }
            const result: ResponseType<Topic | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching topic",
                data: null,
            };
        }
    }

    async getAllTopics(): Promise<ResponseType<Topic[] | null>> {
        try {
            const response: Response = await fetch(`/api/topics`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching topics",
                    data: null,
                };
            }
            const result: ResponseType<Topic[] | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching topics",
                data: null,
            };
        }
    }

    async getTopicsByLevel(
        level: string
    ): Promise<ResponseType<Topic[] | null>> {
        try {
            const response: Response = await fetch(
                `/api/topics/level/${level}`
            );
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching topics",
                    data: null,
                };
            }
            const result: ResponseType<Topic[] | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching topics",
                data: null,
            };
        }
    }

    async createTopic(topic: Topic): Promise<ResponseType<Topic | null>> {
        try {
            const response: Response = await fetch(`/api/topics`, {
                method: "POST",
                body: JSON.stringify(topic),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error creating topic",
                    data: null,
                };
            }
            const result: ResponseType<Topic | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error creating topic",
                data: null,
            };
        }
    }

    async updateTopic(topic: Topic): Promise<ResponseType<Topic | null>> {
        try {
            const response: Response = await fetch(`/api/topics`, {
                method: "PUT",
                body: JSON.stringify(topic),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error updating topic",
                    data: null,
                };
            }
            const result: ResponseType<Topic | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error updating topic",
                data: null,
            };
        }
    }

    async deleteTopic(id: string): Promise<ResponseType<boolean>> {
        try {
            const response: Response = await fetch(`/api/topics/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error deleting topic",
                    data: false,
                };
            }
            const result: ResponseType<boolean> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: result.message,
                    data: false,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error deleting topic",
                data: false,
            };
        }
    }
}
