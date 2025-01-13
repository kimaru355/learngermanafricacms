import { Note } from "../note";
import { ResponseType } from "../ResponseType";

export interface NotesServices {
    getNoteById(id: string): Promise<ResponseType<Note | null>>;
    getAllNotes(): Promise<ResponseType<Note[] | null>>;
    getNotesByTopicId(topicId: string): Promise<ResponseType<Note[] | null>>;
    getNoteByTopicIdAndNumber(
        topicId: string,
        number: number
    ): Promise<ResponseType<Note | null>>;
    createNote(note: Note): Promise<ResponseType<Note | null>>;
    updateNote(note: Note): Promise<ResponseType<Note | null>>;
    deleteNoteById(id: string): Promise<ResponseType<boolean>>;
}
