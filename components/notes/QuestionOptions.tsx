'use client';

import { useToast } from "@/hooks/use-toast";
import { NewNoteQuestionOption, NoteQuestionOption } from "@/lib/interfaces/noteQuestionOption";
import { NoteQuestionOptionService } from "@/services/noteQuestionOptionService";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
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
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export default function QuestionOptions({questionId, setOpen}: {questionId: string, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const { toast } = useToast();
    const [options, setOptions] = useState<NoteQuestionOption[]>([]);
    const [newOption, setNewOption] = useState<NewNoteQuestionOption>({
        noteQuestionId: questionId,
        option: "",
        isCorrect: false,
    });
    const [isEditing, setIsEditing] = useState<NoteQuestionOption | null>(null);
    const optionRef = useRef<HTMLInputElement>(null);

    const addOption = async () => {
        if (!newOption.option) {
            toast({ title: "Option cannot be empty", variant: "destructive" });
            return;
        }
        if (isEditing && isEditing.option === newOption.option && isEditing.isCorrect === newOption.isCorrect) {
            toast({ title: "No changes made", variant: "destructive" });
            return;
        }
        const optionService = new NoteQuestionOptionService();
        const result = isEditing
            ? await optionService.updateNoteQuestionOption({
                ...newOption,
                id: isEditing.id,
                createdAt: isEditing.createdAt, 
                updatedAt: isEditing.updatedAt,
            })
            : await optionService.createNoteQuestionOption(newOption);
        if (!result.success) {
            toast({ title: result.message, variant: "destructive" });
            return;
        }
        toast({ title: "Option saved successfully", variant: "success" });
        if (isEditing) {
            setOptions(prevOptions => {
                return prevOptions.map(option => {
                    if (option.id === isEditing.id) {
                        return {
                            ...option,
                            option: newOption.option,
                            isCorrect: newOption.isCorrect,
                        };
                    }
                    return option;
                });
            }
            );
            setIsEditing(null);
            setNewOption({
                noteQuestionId: questionId,
                option: "",
                isCorrect: false,
            });
            if (optionRef.current) {
                optionRef.current.value = "";
            }
        }
        setOpen(false);
    }

    const deleteOption = async (id: string) => {
        const optionService = new NoteQuestionOptionService();
        const result = await optionService.deleteNoteQuestionOption(id);
        if (!result.success) {
            toast({ title: result.message, variant: "destructive" });
            return;
        }
        toast({ title: "Option deleted successfully", variant: "success" });
        setOptions(options.filter((option) => option.id !== id));
    }

    useEffect(() => {
        if (!questionId) return;
        const fetchQuestionOptions = async () => {
            const optionService = new NoteQuestionOptionService();
            const result = await optionService.getNoteQuestionOptionsByQuestionId(questionId);
            if (!result.success || !result.data) {
                toast({ title: result.message, variant: "destructive" });
                return;
            }
            setOptions(result.data);
        }
        fetchQuestionOptions();
    }, [questionId]);

    return (
        <div>
            <div className="py-2 w-full">

            <h3 className="font-bold text-xl lg:text-2xl">Question Options</h3>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-[rgba(167,126,250,0.1)]">
                    <TableRow>
                        <TableHead>Option</TableHead>
                        <TableHead>is Correct</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {options.map((option) => (
                        <TableRow key={option.id}>
                            <TableCell className="max-w-xs text-lg md:text-xl truncate" title={option.option}>
                                {option.option.length > 30 ? `${option.option.substring(0, 50)}...` : option.option}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {option.isCorrect ? "TRUE" : "FALSE"}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(option.createdAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {format(
                                    new Date(option.updatedAt),
                                    "do MMM yyyy"
                                )}
                            </TableCell>
                            <TableCell className="flex justify-center space-x-2 md:text-lg">
                                <Button className={cn(isEditing && isEditing.id === option.id ? "bg-blue-400 hover:bg-blue-600": "bg-black")} onClick={() => {
                                    if (isEditing && isEditing.id === option.id) {
                                        setIsEditing(null);
                                        setNewOption({
                                            noteQuestionId: questionId,
                                            option: "",
                                            isCorrect: false,
                                        });
                                        if (optionRef.current) {
                                            optionRef.current.value = "";
                                        }
                                    } else {
                                        setIsEditing(option);
                                        setNewOption({
                                            noteQuestionId: questionId,
                                            option: option.option,
                                            isCorrect: option.isCorrect,
                                        });
                                        if (optionRef.current) {
                                            optionRef.current.value = option.option;
                                            optionRef.current.focus();
                                        }
                                    }
                                }}>{isEditing && isEditing.id === option.id ? "Cancel" : "Edit"}</Button>
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
                                                this option and cannot be
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
                                                    deleteOption(option.id);
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
            <div className="space-y-4 mt-4">
                <h3 className="font-semibold text-gray-600 text-xl">{isEditing ? "Update" : "Add"} Option</h3>
                <Label className="text-gray-500 md:text-lg">Option</Label>
                <Input type="text" ref={optionRef} onChange={(e) => {
                    setNewOption((prevOption) => {
                        return {
                            ...prevOption,
                            option: e.target.value,
                        };
                    });
                }}/>
                <Label className="text-gray-500 md:text-lg">Is Correct <span className="text-red-300">(Please note that adding a correct option in a single choice question will make all the other options wrong)</span></Label>
                <Select
                value={newOption.isCorrect ? "TRUE" : "FALSE"}
                onValueChange={(value) => {
                    setNewOption((prevOption) => {
                        return {
                            ...prevOption,
                            isCorrect: value === "TRUE",
                        };
                    });
                }
                }
        >
                    <SelectTrigger className="outline outline-gray-300 text-lg md:text-xl">
                        <SelectValue placeholder={"Is the option correct?"} />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem
                                value={"TRUE"}
                                className="text-lg md:text-xl"
                            >
                                {"TRUE"}
                            </SelectItem>
                            <SelectItem
                                value={"FALSE"}
                                className="text-lg md:text-xl"
                            >
                                {"FALSE"}
                            </SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={addOption}>{isEditing ? "Update" : "Add"} Option</Button>
            </div>
        </div>
    )
}