// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Level } from "@/lib/interfaces/levels";
// import { ResponseType } from "@/lib/interfaces/ResponseType";
// import axios from "axios";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import { cookies } from "next/headers";

// export default async function Levels() {
//     const levels: Level[] = [];
//     console.log("trying with credentials");
//     const cookieStore = cookies();
//     const auth_token = (await cookieStore).get("auth_token")?.value;
//     try {
//         const response: ResponseType<Level[] | null> = (
//             await axios.get(
//                 (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
//                     "/api/levels",
//                 {
//                     withCredentials: true,
//                     headers: {
//                         Cookie: `auth_token=${auth_token}`,
//                     },
//                 }
//             )
//         ).data;

//         if (!response.success || !response.data) {
//             return <div>{response.message}</div>;
//         }
//         levels.push(response.data.filter((level) => level.name === "A1")[0]);
//         levels.push(response.data.filter((level) => level.name === "A2")[0]);
//         levels.push(response.data.filter((level) => level.name === "B1")[0]);
//         levels.push(response.data.filter((level) => level.name === "B2")[0]);
//         levels.push(response.data.filter((level) => level.name === "C1")[0]);
//         levels.push(response.data.filter((level) => level.name === "C2")[0]);
//     } catch {
//         return <div>An Error Occurred</div>;
//     }

//     return (
//         <section>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Level</TableHead>
//                         <TableHead>Image</TableHead>
//                         <TableHead>Description</TableHead>
//                         <TableHead>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {levels.map((level) => (
//                         <TableRow key={level.id}>
//                             <TableCell>{level.name}</TableCell>
//                             <TableCell>
//                                 <Image
//                                     src={level.imageUrl}
//                                     alt={level.name}
//                                     width={100}
//                                     height={100}
//                                     className="w-20 max-w-20 h-20 max-h-20 object-cover"
//                                 />
//                             </TableCell>
//                             <TableCell>{level.description}</TableCell>
//                             <TableCell>
//                                 <Button className="bg-green-500 hover:bg-green-700">
//                                     Edit
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </section>
//     );
// }

export default function Page() {
    return <div></div>;
}
