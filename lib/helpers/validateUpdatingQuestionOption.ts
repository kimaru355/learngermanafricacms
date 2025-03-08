import { NoteQuestionDB } from "../interfaces/noteQuestionDB";
import { NoteQuestionOption } from "../interfaces/noteQuestionOption";
import { QuestionType } from "../interfaces/questionType";
import { ResponseType } from "../interfaces/ResponseType";

export default function validateUpdatingQuestionOption(currentOptions: NoteQuestionOption[], newOption: NoteQuestionOption, question: NoteQuestionDB): ResponseType<null> {
    const prevOption = currentOptions.find(option => option.id === newOption.id);
    if (!prevOption) {
        return {
            success: false,
            message: "Note question option not found.",
            data: null
        }
    } else {
        // if the option is not changed, return success
        if (prevOption.isCorrect === newOption.isCorrect) {
            return {
                success: true,
                message: "Note question option updated successfully.",
                data: null
            }
        }
    }
    if (question.questionType === QuestionType.TRUE_FALSE) {
        return {
            success: false,
            message: "True/False questions can only have two options. No need to provide the options.",
            data: null
        };
    }
    if (currentOptions.length === 0 || currentOptions.length === 1) {
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
        if (newOption.isCorrect) {
            return {
                success: true,
                message: "Note question option created successfully.",
                data: null
            }
        }
        let isValid: boolean = false;
        currentOptions.map(option => {
            if (option.isCorrect && option.id !== newOption.id) {
                isValid = true;
            }
        })
        if (isValid) {
            return {
                success: true,
                message: "Note question option created successfully.",
                data: null
            }
        } else {
            return {
                success: false,
                message: "Please provide a correct option. There should be at least 1 correct option.",
                data: null
            }
        }
    } else if (question.questionType === QuestionType.SINGLE_CHOICE) {
        if (!newOption.isCorrect) {
            return {
                success: false,
                message: "Single choice questions must have one correct option. Add or make another option correct instead.",
                data: null
            }
        } else {
            return {
                success: true,
                message: "update single choice",
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