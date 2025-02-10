import { Note, NoteDb } from "./note";
import { Topic } from "./topic";

export interface NoteWithDetails {
    note: Note;
    topic: Topic;
    count: number;
}

export interface NoteWithDetailsDb {
    note: NoteDb;
    topic: Topic;
    count: number;
}
