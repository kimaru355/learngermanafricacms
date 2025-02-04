import { z } from "zod";

export const newTopicSchema = z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    levelId: z.string(),
});

export type NewTopic = z.infer<typeof newTopicSchema>;
