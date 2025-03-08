import { NewNoteQuestion } from "@/lib/definitions/newNoteQuestionSchema";
import { NoteQuestion } from "../noteQuestion";
import { ResponseType } from "../ResponseType";

export interface NoteQuestionServices {
    getNoteQuestions(): Promise<ResponseType<NoteQuestion[] | null>>;
    getNoteQuestionByNoteId(noteId: string): Promise<ResponseType<NoteQuestion[] | null>>;
    createNoteQuestion(newNoteQuestion: NewNoteQuestion): Promise<ResponseType<null>>;
    updateNoteQuestion(noteQuestion: NoteQuestion): Promise<ResponseType<null>>;
    deleteNoteQuestion(id: string): Promise<ResponseType<null>>;
}