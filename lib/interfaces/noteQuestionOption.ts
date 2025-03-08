export interface NoteQuestionOption {
    id: string,
    option: string,
    isCorrect: boolean,
    noteQuestionId: string,
    createdAt: Date,
    updatedAt: Date
}

export interface NewNoteQuestionOption {
    option: string,
    isCorrect: boolean,
    noteQuestionId: string
}