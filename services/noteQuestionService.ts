import { NoteQuestion } from "@/lib/interfaces/noteQuestion";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NoteQuestionServices } from "@/lib/interfaces/services/noteQuestion";

export class NoteQuestionService implements NoteQuestionServices {
    async getNoteQuestions(): Promise<ResponseType<NoteQuestion[] | null>> {
        try {
            const response = await fetch("/api/note-question");
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching Note Questions",
                    data: null,
                };
            }
            const result = await response.json();
            return result;
        } catch {
            return { success: false, message: "Error fetching note questions", data: null };
        }
        
    }

    async getNoteQuestionByNoteId(noteId: string): Promise<ResponseType<NoteQuestion[] | null>> {
        try {
            const response = await fetch(`/api/note-question/note/${noteId}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching Note Questions",
                    data: null,
                };
            }
            const result = await response.json();
            return result;
        } catch {
            return { success: false, message: "Error fetching note questions", data: null };
        }
    }

    async createNoteQuestion(newNoteQuestion: NoteQuestion): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/note-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newNoteQuestion)
            });
            const result = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error creating Note Question",
                    data: null,
                };
            }
            return result;
        } catch {
            return { success: false, message: "Error creating note question", data: null };
        }
    }
}