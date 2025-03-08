"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { NoteQuestionService } from "@/services/noteQuestionService";
import { useEffect, useState } from "react";
import { NoteQuestion } from "@/lib/interfaces/noteQuestion";
import CreateQuestion from "./Question";

export default function Questions({ noteId }: {noteId: string}) {
    const { toast } = useToast();
    const [questions, setQuestions] = useState<NoteQuestion[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const noteQuestionService = new NoteQuestionService();
            const result = await noteQuestionService.getNoteQuestionByNoteId(noteId);
            if (!result.success || !result.data) {
                toast({
                    title: "Error fetching question",
                    variant: "destructive",
                });
                return;
            }
            setQuestions(result.data);
        
        }
        fetchQuestions();
    }, [noteId]);

    const deleteQuestion = async (id: string) => {
        try {
            const questionService = new NoteQuestionService();
            const result = await questionService.deleteNoteQuestion(id);
            if (!result.success) {
                toast({
                    title: "Error deleting question",
                    variant: "destructive",
                });
                return;
            }
            setQuestions(questions.filter((question) => question.id !== id));
            toast({
                title: "Question deleted successfully",
                variant: "success",
            });

        } catch {
            toast({
                title: "Error deleting question",
                variant: "destructive",
            });
        }
    }

    return (
        
        <section className="bg-white p-2 lg:p-8 w-full min-h-80">
            <div className="flex justify-between my-4 w-full text-lg">
                <h2 className="font-semibold text-2xl md:text-3xl">Questions</h2>
                <CreateQuestion noteId={noteId} oldQuestion={null} number={questions.length + 1} />
            </div>
            <Table className="w-full">
                <TableHeader className="bg-[rgba(167,126,250,0.1)]">
                    <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Question Type</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {questions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell className="max-w-xs text-lg md:text-xl truncate" title={question.question}>
                                {question.question.length > 50 ? `${question.question.substring(0, 50)}...` : question.question}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {question.questionType}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {question.number}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(question.createdAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(question.updatedAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="flex justify-center space-x-2 md:text-lg">
                                <CreateQuestion noteId={noteId} oldQuestion={question} number={question.number} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="bg-white py-1 border border-[#FF3C5F] rounded-xl w-24 text-[#FF3C5F]">
                                            Delete
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will <span className="text-red-400">permanently</span> delete
                                                this question and <span className="text-red-400">ALL</span> of its <span className="text-red-400">OPTIONS AND ANSWERS</span> and cannot be
                                                recovered.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-400 hover:bg-red-600 text-white hover:cursor-pointer"
                                                onClick={() => {
                                                    deleteQuestion(question.id);
                                                }}
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}