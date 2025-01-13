import { ResponseType } from "@/lib/interfaces/ResponseType";
import { Topic } from "@/lib/interfaces/topic";
import axios from "axios";
import dotenv from "dotenv";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

export default async function Topics() {
    dotenv.config();
    let topics: Topic[] = [];
    try {
        const response: ResponseType<Topic[] | null> = (
            await axios.get(
                process.env.NEXT_PUBLIC_API_BASE_URL + "/api/topics"
            )
        ).data;
        if (!response.success || !response.data) {
            return <div>{response.message}</div>;
        }
        topics = response.data;
    } catch {
        return <div>An Error Occurred</div>;
    }

    return (
        <section>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="">Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topics.map((topic) => (
                        <TableRow key={topic.id}>
                            <TableCell>{topic.name}</TableCell>
                            <TableCell className="truncated">
                                {topic.description}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                                <Button className="bg-green-500 hover:bg-green-700">
                                    Edit
                                </Button>
                                <Button className="bg-red-500 hover:bg-red-700">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}
