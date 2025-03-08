import { NoteQuestionDB } from "../interfaces/noteQuestionDB";
import { NoteQuestionOption } from "../interfaces/noteQuestionOption";
import { QuestionType } from "../interfaces/questionType";
import { ResponseType } from "../interfaces/ResponseType";

export default function validateDeletingQuestionOption(currentOptions: NoteQuestionOption[], newOption: NoteQuestionOption, question: NoteQuestionDB): ResponseType<null> {
    if (question.questionType === QuestionType.TRUE_FALSE) {
        return {
            success: true,
            message: "True/False questions can only have two options. No need to provide the options.",
            data: null
        };
    }
    if (currentOptions.length === 0 || currentOptions.length === 1) {
        return {
            success: true,
            message: "Note question option deleted successfully.",
            data: null
        }
    }
    if (question.questionType === QuestionType.FILL_IN_THE_BLANK) {
        return {
            success: true,
            message: "Fill in the blank questions require only one option.",
            data: null
        };
    } else if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
        let isThereCorrect: boolean = false;
        currentOptions.map(option => {
            if (option.isCorrect && option.id !== newOption.id) {
                isThereCorrect = true;
            }
        })
        if (isThereCorrect) {
            return {
                success: true,
                message: "Note question option deleted successfully.",
                data: null
            }
        } else {
            return {
                success: false,
                message: "Please delete other options or make option correct. There should be at least 1 correct option.",
                data: null
            }
        }
    } else if (question.questionType === QuestionType.SINGLE_CHOICE) {
        if (newOption.isCorrect) {
            return {
                success: false,
                message: "Single choice questions must have one correct option. Add or make another option correct instead.",
                data: null
            }
        } else {
            return {
                success: true,
                message: "Note question option deleted successfully.",
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