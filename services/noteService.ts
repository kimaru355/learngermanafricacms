import { NewNote } from "@/lib/interfaces/newNote";
import { Note } from "@/lib/interfaces/note";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NotesServices } from "@/lib/interfaces/services/notes";

export class NoteService implements NotesServices {
    async getAllNotes(): Promise<ResponseType<Note[] | null>> {
        try {
            const response = await fetch("/api/notes");
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching notes",
                    data: null,
                };
            }
            const result: ResponseType<Note[]> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Notes fetched successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching notes",
                data: null,
            };
        }
    }

    async getNoteById(id: string): Promise<ResponseType<Note | null>> {
        try {
            const response = await fetch(`/api/notes/note/${id}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching note",
                    data: null,
                };
            }
            const result: ResponseType<Note> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Note fetched successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching note",
                data: null,
            };
        }
    }

    async getNotesByTopicId(
        topicId: string
    ): Promise<ResponseType<Note[] | null>> {
        try {
            const response = await fetch(`/api/notes/topic/${topicId}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching notes",
                    data: null,
                };
            }
            const result: ResponseType<Note[]> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Notes fetched successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching notes",
                data: null,
            };
        }
    }

    async getNoteByTopicIdAndNumber(
        topicId: string,
        number: number
    ): Promise<ResponseType<Note | null>> {
        try {
            const response = await fetch(
                `/api/notes/topic/${topicId}/${number}`
            );
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching note",
                    data: null,
                };
            }
            const result: ResponseType<Note> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Note fetched successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error fetching note",
                data: null,
            };
        }
    }

    async createNote(note: NewNote): Promise<ResponseType<Note | null>> {
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(note),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error creating note",
                    data: null,
                };
            }
            const result: ResponseType<Note> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Note created successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error creating note",
                data: null,
            };
        }
    }

    async updateNote(note: Note): Promise<ResponseType<Note | null>> {
        try {
            const response = await fetch(`/api/notes/note/${note.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(note),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error updating note",
                    data: null,
                };
            }
            const result: ResponseType<Note> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: null,
                };
            }
            return {
                success: true,
                message: "Note updated successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error updating note",
                data: null,
            };
        }
    }

    async deleteNoteById(id: string): Promise<ResponseType<boolean>> {
        try {
            const response = await fetch(`/api/notes/note/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error deleting note",
                    data: false,
                };
            }
            const result: ResponseType<boolean> = await response.json();
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                    data: false,
                };
            }
            return {
                success: true,
                message: "Note deleted successfully",
                data: result.data,
            };
        } catch {
            return {
                success: false,
                message: "Error deleting note",
                data: false,
            };
        }
    }
}
