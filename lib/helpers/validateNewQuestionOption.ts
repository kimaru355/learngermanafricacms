import { NoteQuestionDB } from "../interfaces/noteQuestionDB";
import { NewNoteQuestionOption, NoteQuestionOption } from "../interfaces/noteQuestionOption";
import { QuestionType } from "../interfaces/questionType";
import { ResponseType } from "../interfaces/ResponseType";

export default function validateNewQuestionOption(currentOptions: NoteQuestionOption[], newOption: NewNoteQuestionOption, question: NoteQuestionDB): ResponseType<null> {
    if (question.questionType === QuestionType.TRUE_FALSE) {
        return {
            success: false,
            message: "True/False questions can only have two options. No need to provide the options.",
            data: null
        };
    }
    if (currentOptions.length === 0) {
        if (newOption.isCorrect) {
            return {
                success: true,
                message: "Note question option created successfully.",
                data: null
            }
        } else {
            return {
                success: false,
                message: "Please provide a correct option. The first option must be correct to ensure there is always a correct answer.",
                data: null
            }
        }
    }
    if (question.questionType === QuestionType.FILL_IN_THE_BLANK) {
        return {
            success: false,
            message: "Fill in the blank questions require only one option.",
            data: null
        };
    } else if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
        return {
            success: true,
            message: "Note question option created successfully.",
            data: null
        }
    } else if (question.questionType === QuestionType.SINGLE_CHOICE) {
        if (newOption.isCorrect) {
            return {
                success: false,
                message: "Single choice questions can only have one correct option. Please make sure only one option is correct.",
                data: null
            }
        } else {
            return {
                success: true,
                message: "Note question option created successfully.",
                data: null
            }
        }
    }
    return {
        success: false,
        message: "Error validation options.",
        data: null
    }
}