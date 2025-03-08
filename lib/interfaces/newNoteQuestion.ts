import { QuestionType } from "./questionType";

export interface NewNoteQuestion {
    question: string;
    questionType: QuestionType;
    number: number;
    noteId: string;
}