import { QuestionType } from "@prisma/client";

export interface NoteQuestionDB {
    id: string;
    question: string;
    questionType: QuestionType;
    number: number;
    noteId: string;
    createdAt: Date;
    updatedAt: Date;
}