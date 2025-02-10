"use client";

import { useRef, useState } from "react";
import { Level } from "@/lib/interfaces/levels";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRightIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseType } from "@/lib/interfaces/ResponseType";

export default function UpdateLevel({ level }: { level: Level }) {
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const updateLevel = async () => {
        if (!descriptionRef || !descriptionRef.current) {
            return;
        }
        const description = descriptionRef.current.value;
        if (!description) {
            toast({
                title: "Description is required",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch("/api/levels/name/" + level.name, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description, imageUrl: level.imageUrl }),
            });
            if (!response.ok) {
                toast({
                    title: "Failed to update level",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<null> = await response.json();
            if (!result.success || !result.data) {
                toast({
                    title: "Failed to update level",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Level updated",
                variant: "success",
            });
            setOpen(false);
            window.location.reload();
        } catch {
            toast({
                title: "Failed to update level",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-white hover:bg-black/10 py-2 border border-black rounded-xl w-full text-black text-center">
                Edit Description
                <ArrowUpRightIcon className="inline" />
            </DialogTrigger>
            <DialogContent className="md:max-w-[50rem]">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl md:text-4xl">
                        {level.name} description
                    </DialogTitle>
                    <DialogDescription>
                        Edit the description. Save when done.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    rows={8}
                    name="description"
                    ref={descriptionRef}
                    className="mt-4 text-lg md:text-2xl"
                    defaultValue={level.description}
                />
                <DialogFooter>
                    <Button onClick={updateLevel}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
