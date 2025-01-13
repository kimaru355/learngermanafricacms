import { Note } from "./note";
import { Topic } from "./topic";

export interface NoteWithDetails {
    note: Note;
    topic: Topic;
    count: number;
}
