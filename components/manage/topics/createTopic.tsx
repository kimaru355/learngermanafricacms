"use client";

import { NewTopic, newTopicSchema } from "@/lib/definitions/newTopicSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function CreateTopic({ newTopic }: { newTopic?: NewTopic }) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof newTopicSchema>>({
        resolver: zodResolver(newTopicSchema),
        defaultValues: {
            name: newTopic?.name ?? "",
            description: newTopic?.description ?? "",
            imageUrl: newTopic?.imageUrl ?? "",
            levelId: newTopic?.levelId ?? "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof newTopicSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
