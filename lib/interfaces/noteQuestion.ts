import { QuestionType } from "./questionType";

export interface NoteQuestion {
    id: string;
    question: string;
    questionType: QuestionType;
    number: number;
    noteId: string;
    createdAt: Date;
    updatedAt: Date;
}