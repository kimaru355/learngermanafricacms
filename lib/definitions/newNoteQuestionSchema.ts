import { z } from 'zod';
import { QuestionType } from '../interfaces/questionType';

export const newNoteQuestionSchema = z.object({
    question: z.string(),
    questionType: z.enum(Object.values(QuestionType) as [string, ...string[]]),
    number: z.number(),
    noteId: z.string(),
});

export type NewNoteQuestion = z.infer<typeof newNoteQuestionSchema>;