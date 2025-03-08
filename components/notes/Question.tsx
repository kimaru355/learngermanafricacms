"use client";

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { NoteQuestion } from "@/lib/interfaces/noteQuestion";
import { NoteQuestionService } from "@/services/noteQuestionService";
import { QuestionType } from "@/lib/interfaces/questionType";
import { NewNoteQuestion } from "@/lib/interfaces/newNoteQuestion";
import { cn } from "@/lib/utils";
import QuestionOptions from "./QuestionOptions";

export default function CreateQuestion({
    noteId,
    oldQuestion,
    number
}: {
    noteId: string;
    oldQuestion: NoteQuestion | null;
    number: number;
}) {
    const [open, setOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState<NewNoteQuestion>( {
        noteId: noteId,
        question: oldQuestion?.question || "",
        questionType: oldQuestion?.questionType || QuestionType.SINGLE_CHOICE,
        number: oldQuestion?.number || number,
    });
    const { toast } = useToast();

    const saveQuestion = async () => {
        if (!newQuestion.noteId || !newQuestion.question || !newQuestion.questionType || !newQuestion.number) {
            toast({
                title: "Please fill all the fields: question, questionType, number",
                variant: "destructive",
            });
            return;
        }
        if ( oldQuestion &&
            newQuestion.number === oldQuestion.number &&
            newQuestion.question === oldQuestion.question &&
            newQuestion.questionType === oldQuestion.questionType
        ) {
            toast({
                title: "No changes have been made",
                variant: "destructive",
            });
            return;
        }
        const questionService = new NoteQuestionService();
        const result =
            oldQuestion === null
                ? await questionService.createNoteQuestion(newQuestion)
                : await questionService.updateNoteQuestion({
                      id: oldQuestion.id,
                      ...newQuestion,
                      createdAt: oldQuestion.createdAt,
                      updatedAt: oldQuestion.updatedAt,
                  });
        if (!result.success) {
            toast({
                title: "Error saving note",
                description: result.message,
                variant: "destructive",
            });
            return;
        }
        toast({
            title:
                oldQuestion === null
                    ? "Question created successfully"
                    : "Question updated successfully",
                variant: "success",
        });
        setOpen(false);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    useEffect(() => {
        if (!oldQuestion || newQuestion.questionType === QuestionType.TRUE_FALSE) {
            return;
        }
        const fetchQuestionOptions = async () => {}
        fetchQuestionOptions();
    }, []);

    useEffect(() => {
        if (oldQuestion) {
            setNewQuestion({
                noteId: noteId,
                question: oldQuestion.question,
                questionType: oldQuestion.questionType,
                number: number,
            });
        }
    }, [oldQuestion]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={cn(oldQuestion === null ? "bg-black px-4 py-2 rounded-xl text-white text-center" : "bg-white py-1 border border-[#000412] rounded-xl w-24 text-[#000412] text-center")}>
                {oldQuestion === null ? "+ Add Question" : "Edit"}
            </DialogTrigger>
            <DialogContent className="md:max-w-[50rem]">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl md:text-4xl">
                        Question
                    </DialogTitle>
                    <DialogDescription>
                        Edit the question. Save when done.
                    </DialogDescription>
                </DialogHeader>

                <Label className="text-gray-500 md:text-lg">Question</Label>
                <Input
                    type="text"
                    defaultValue={
                        newQuestion.question
                    }
                    onChange={(e) => {
                        setNewQuestion((prevQuestion) => {
                            return {
                                ...prevQuestion,
                                question: e.target.value,
                            };
                        });
                    }}
                />

                <Label className="text-gray-500 md:text-lg">Question Type <span className="text-red-400">(*Please note that changing the question type will delete all existing question options)</span></Label>
                <Select
                    onValueChange={(value) => {
                        setNewQuestion((prevQuestion) => {
                            return {
                                ...prevQuestion,
                                questionType: value as QuestionType,
                            };
                        });
                    }}
                    defaultValue={
                        newQuestion.questionType
                    }
                >
                    <SelectTrigger className="outline outline-gray-300 text-lg md:text-xl">
                        <SelectValue placeholder={"Choose a level"} />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(QuestionType).map((questionType, index) => (
                            <SelectItem
                                key={index}
                                value={questionType}
                                className="text-lg md:text-xl"
                            >
                                {questionType}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label className="text-gray-500 md:text-lg">Number</Label>
                <Input
                    type="number"
                    defaultValue={
                        newQuestion.number
                    }
                    onChange={(e) => {
                        setNewQuestion((prevQuestion) => {
                            return {
                                ...prevQuestion,
                                number: +e.target.value,
                            };
                        });
                    }}
                />
                <DialogFooter>
                    <Button onClick={saveQuestion}>Save changes</Button>
                </DialogFooter> 

                <div>
                    { oldQuestion?.questionType === QuestionType.TRUE_FALSE && newQuestion.questionType !== QuestionType.TRUE_FALSE ? (
                        <div>
                            <p>Please save the question first to add options...</p>
                        </div>
                    ) : newQuestion.questionType === QuestionType.TRUE_FALSE ? (
                        <div>
                            <p>You cannot add question options in True False questions...</p>
                        </div>
                    ) : oldQuestion ? <QuestionOptions questionId={oldQuestion.id} setOpen={setOpen} /> : (
                        <div>
                            <p>Please save the question to add options...</p>
                        </div>
                    ) }
                </div>
            </DialogContent>
        </Dialog>
    );
}
