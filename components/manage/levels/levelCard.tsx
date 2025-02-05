"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Level } from "@/lib/interfaces/levels";
import Image from "next/image";
import UpdateLevel from "./updateLevel";
import { CldUploadWidget } from "next-cloudinary";
import { ArrowUpRightIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseType } from "@/lib/interfaces/ResponseType";

export default function LevelCard({ level }: { level: Level }) {
    const { toast } = useToast();

    const handleImageUpload = async (imageUrl: string) => {
        try {
            if (!imageUrl) {
                toast({
                    title: "Image Upload Failed",
                    description: "Please try again",
                    variant: "destructive",
                });
                return;
            }
            const response = await fetch(`/api/levels/level/${level.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    fieldToUpdate: "imageUrl",
                    value: imageUrl,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                toast({
                    title: "Image Upload Failed",
                    description: "Please try again",
                    variant: "destructive",
                });
                return;
            }
            const result: ResponseType<null> = await response.json();
            if (!result.success) {
                toast({
                    title: "Image Upload Failed",
                    description: "Please try again",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Image Uploaded",
                description: "Image uploaded successfully",
                variant: "success",
            });
            level.imageUrl = imageUrl;
        } catch {
            toast({
                title: "Image Upload Failed",
                description: "Please try again",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full md:max-w-96">
            <CardHeader>
                <Image
                    src={level.imageUrl}
                    alt={level.name}
                    width={400}
                    height={240}
                    className="rounded-xl w-auto h-60 object-cover"
                />
                <div className="flex justify-between items-center w-full">
                    <CardTitle>{level.name}</CardTitle>
                    <CardDescription className="bg-[rgba(167,126,250,0.16)] px-6 py-1 rounded-xl text-[#A77EFA]">
                        Level
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-4 h-24">{level.description}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
                <UpdateLevel level={level} />

                <CldUploadWidget
                    uploadPreset="learn_german_africa_unsigned"
                    options={{
                        sources: ["local"], // Allow uploads from device
                        resourceType: "image", // Restrict to images only
                        maxFiles: 1, // Allow only one file per upload
                    }}
                    onSuccess={(result) => {
                        if (
                            !result.info ||
                            typeof result.info === "string" ||
                            !result.info.secure_url
                        ) {
                            return;
                        }
                        handleImageUpload(result.info.secure_url);
                    }}
                >
                    {({ open }) => {
                        return (
                            <button
                                onClick={() => {
                                    open();
                                }}
                                className="bg-white hover:bg-black/10 py-2 border border-black rounded-xl w-full text-black text-center"
                            >
                                Edit Image
                                <ArrowUpRightIcon className="inline" />
                            </button>
                        );
                    }}
                </CldUploadWidget>
            </CardFooter>
        </Card>
    );
}
