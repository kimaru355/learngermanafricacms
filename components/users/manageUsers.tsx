"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResponseType } from "@/lib/interfaces/ResponseType";
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
import UserService from "@/services/userService";
import { User, UserRegister } from "@/lib/interfaces/user";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<UserRegister | null>(null);
    const [newUserOpen, setNewUserOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userService = new UserService();
                const result: ResponseType<User[] | null> =
                    await userService.getUsers();
                if (!result.success || !result.data) {
                    toast({
                        title: "Error fetching users",
                        description: result.message,
                        variant: "destructive",
                    });
                    return;
                }
                setUsers(result.data);
            } catch {
                return <div>An Error Occurred</div>;
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (id: string) => {
        try {
            const userService = new UserService();
            const result = await userService.deleteUser(id);
            if (!result.success) {
                toast({
                    title: "Error deleting user",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            setUsers((prev) => prev.filter((user) => user.id !== id));
            toast({
                title: "User deleted",
                description: "User has been deleted successfully.",
                variant: "success",
            });
        } catch {
            toast({
                title: "An error occurred",
                description: "An error occurred while deleting user.",
                variant: "destructive",
            });
        }
    };

    const addUser = async () => {
        try {
            if (!newUser || !newUser.name || newUser.name.split(" ").length !== 2 || !newUser.email) {
                toast({
                    title: "Invalid user details",
                    description: !newUser
                        ? "Full name and email are required"
                        : !newUser?.name
                        ? "Full name is required"
                        : "email is required.",
                    variant: "destructive",
                });
                return;
            }
            const userService = new UserService();
            const result = await userService.addUser(newUser);
            if (!result.success) {
                toast({
                    title: "Error adding user",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "User added",
                description: result.message,
                variant: "success",
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch {
            toast({
                title: "An error occurred",
                description: "An error occurred while adding user.",
                variant: "destructive",
            });
        }
    };

    const updateUserRole = async (id: string, role: string) => {
        try {
            if (users.find((user) => user.id === id)?.role === role) {
                toast({
                    title: "Role not changed",
                    description: "Role is already set to " + role,
                    variant: "info",
                });
                return;
            }
            const userService = new UserService();
            const result = await userService.updateUserRole(id, role);
            if (!result.success) {
                toast({
                    title: "Error updating user role",
                    description: result.message,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "User role updated",
                description: result.message,
                variant: "success",
            });
        } catch {
            toast({
                title: "An error occurred",
                description: "An error occurred while updating user role.",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="bg-white px-2 py-2 rounded-xl md:rounded-4xl w-full">
            <div className="flex justify-between my-4 w-full text-lg">
                <h2 className="font-semibold text-2xl md:text-3xl">Topics</h2>

                <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
                    <DialogTrigger className="bg-black px-4 py-2 rounded-xl text-white text-center">
                        + Add User
                    </DialogTrigger>
                    <DialogContent className="md:max-w-[50rem]">
                        <DialogHeader>
                            <DialogTitle className="font-semibold text-2xl md:text-4xl">
                                Add New User
                            </DialogTitle>
                            <DialogDescription>
                                Enter the details. Please note that their email
                                will be used to create initial password.
                                <br />
                                Example email: &lsquo;test@gmail.com&rsquo; will
                                have &lsquo;test&rsquo; as password
                            </DialogDescription>
                        </DialogHeader>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={(e) => {
                                setNewUser((prev) => {
                                    if (!prev) {
                                        return {
                                            name: e.target.value,
                                            email: "",
                                        };
                                    }
                                    return {
                                        ...prev,
                                        name: e.target.value,
                                    };
                                });
                            }}
                        />
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => {
                                setNewUser((prev) => {
                                    if (!prev) {
                                        return {
                                            name: "",
                                            email: e.target.value,
                                        };
                                    }
                                    return {
                                        ...prev,
                                        email: e.target.value,
                                    };
                                });
                            }}
                        />
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    addUser();
                                }}
                            >
                                Add user
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-[rgba(167,126,250,0.1)]">
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="text-lg md:text-xl">
                                {user.email}
                            </TableCell>
                            <TableCell className="text-lg md:text-xl">
                                {user.name}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {user.role}
                            </TableCell>
                            <TableCell className="md:text-lg">
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt={user.name + " image"}
                                        width={40}
                                        height={40}
                                        className="rounded-full size-10"
                                    />
                                ) : (
                                    <div className="bg-gray-400 rounded-full size-10"></div>
                                )}
                            </TableCell>
                            <TableCell className="flex justify-center space-x-2 md:text-lg">
                                <Select
                                    onValueChange={(value) => {
                                        updateUserRole(user.id, value);
                                    }}
                                >
                                    <SelectTrigger className="outline outline-gray-300 text-lg md:text-xl">
                                        <SelectValue placeholder={user.role} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="ADMIN"
                                            className="text-lg md:text-xl"
                                        >
                                            ADMIN
                                        </SelectItem>
                                        <SelectItem
                                            value="AGENT"
                                            className="text-lg md:text-xl"
                                        >
                                            AGENT
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="bg-white py-1 border border-[#FF3C5F] rounded-xl w-24 text-[#FF3C5F]">
                                            Delete
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl md:text-3xl">
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-lg md:text-xl">
                                                This action cannot be undone.
                                                This will permanently delete
                                                this{" "}
                                                <span className="text-red-400">
                                                    topic
                                                </span>{" "}
                                                and{" "}
                                                <span className="text-red-400">
                                                    ALL
                                                </span>{" "}
                                                of it&rsquo;s
                                                <span className="text-red-400">
                                                    {" "}
                                                    notes.
                                                </span>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="text-lg">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-400 hover:bg-red-600 text-white text-lg hover:cursor-pointer"
                                                onClick={() => {
                                                    deleteUser(user.id);
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
    );
}
