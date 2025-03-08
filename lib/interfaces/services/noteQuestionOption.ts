import { NewNoteQuestionOption, NoteQuestionOption } from "../noteQuestionOption";
import { ResponseType } from "../ResponseType";

export interface NoteQuestionOptionServices {
    getNoteQuestionOptions(): Promise<ResponseType<NoteQuestionOption[] | null>>;
    getNoteQuestionOptionsByQuestionId(questionId: string): Promise<ResponseType<NoteQuestionOption[] | null>>;
    createNoteQuestionOption(newNoteQuestionOption: NewNoteQuestionOption): Promise<ResponseType<null>>;
    updateNoteQuestionOption(noteQuestionOption: NoteQuestionOption): Promise<ResponseType<null>>;
    deleteNoteQuestionOption(id: string): Promise<ResponseType<null>>;
}