import { NewNoteQuestion } from "@/lib/definitions/newNoteQuestionSchema";
import { NoteQuestion } from "../noteQuestion";
import { ResponseType } from "../ResponseType";

export interface NoteQuestionServices {
    getNoteQuestions(): Promise<ResponseType<NoteQuestion[] | null>>;
    getNoteQuestionByNoteId(noteId: string): Promise<ResponseType<NoteQuestion[] | null>>;
    createNoteQuestion(newNoteQuestion: NewNoteQuestion): Promise<ResponseType<null>>;
}