'use client';

import { useToast } from "@/hooks/use-toast";
import { NoteQuestionService } from "@/services/noteQuestionService";
import { useEffect } from "react";

export default function Questions({ noteId }: {noteId: string}) {
    console.log(noteId);
    const { toast } = useToast();

    useEffect(() => {
        const fetchQuestion = async () => {
            const noteQuestionService = new NoteQuestionService();
            const result = await noteQuestionService.getNoteQuestionByNoteId(noteId);
            if (!result.success) {
                toast({
                    title: "Error fetching question",
                    variant: "destructive",
                });
                return;
            }
            console.log(result.data);
        
        }
        fetchQuestion();
    }, [noteId]);

    return <div></div>
}