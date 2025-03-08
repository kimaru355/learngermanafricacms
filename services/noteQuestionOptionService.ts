import { NewNoteQuestionOption, NoteQuestionOption } from "@/lib/interfaces/noteQuestionOption";
import { ResponseType } from "@/lib/interfaces/ResponseType";
import { NoteQuestionOptionServices } from "@/lib/interfaces/services/noteQuestionOption";

export class NoteQuestionOptionService implements NoteQuestionOptionServices {
    async getNoteQuestionOptions(): Promise<ResponseType<NoteQuestionOption[] | null>> {
        try {
            const response = await fetch("/api/note-question-options");
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching Note Question Options",
                    data: null,
                };
            }
            const result = await response.json();
            return result;
        } catch {
            return { success: false, message: "Error fetching note question options", data: null };
        }
        
    }

    async getNoteQuestionOptionsByQuestionId(questionId: string): Promise<ResponseType<NoteQuestionOption[] | null>> {
        try {
            const response = await fetch(`/api/note-question-options/question/${questionId}`);
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching Note Question Options",
                    data: null,
                };
            }
            const result = await response.json();
            return result;
        } catch {
            return { success: false, message: "Error fetching note question options", data: null };
        }
    }

    async createNoteQuestionOption(newNoteQuestion: NewNoteQuestionOption): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/note-question-options", {
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
                    message: "Error creating Note Question Option",
                    data: null,
                };
            }
            return result;
        } catch {
            return { success: false, message: "Error creating note question option", data: null };
        }
    }

    async updateNoteQuestionOption(noteQuestionOption: NoteQuestionOption): Promise<ResponseType<null>> {
        try {
            const response = await fetch(`/api/note-question-options/option/${noteQuestionOption.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(noteQuestionOption)
            });
            const result = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error updating Note Question Option",
                    data: null,
                };
            }
            return result;
        } catch {
            return { success: false, message: "Error updating note question option", data: null };
        }
    }

    async deleteNoteQuestionOption(id: string): Promise<ResponseType<null>> {
        try {
            const response = await fetch(`/api/note-question-options/option/${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error deleting Note Question Option",
                    data: null,
                };
            }
            return result;
        } catch {
            return { success: false, message: "Error deleting note question option", data: null };
        }
    }
}