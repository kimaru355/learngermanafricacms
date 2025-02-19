import { ResponseType } from "@/lib/interfaces/ResponseType";
import { UserServices } from "@/lib/interfaces/services/user";
import { User, UserRegister } from "@/lib/interfaces/user";

export default class UserService implements UserServices {
    async getUsers(): Promise<ResponseType<User[] | null>> {
        try {
            const response = await fetch("/api/users");
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error fetching users",
                    data: null,
                };
            }
            const result: ResponseType<User[] | null> = await response.json();
            if (!result.success || !result.data) {
                return {
                    success: false,
                    message: "Error fetching users",
                    data: null,
                };
            }
            return result;
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }

    async deleteUser(id: string): Promise<ResponseType<null>> {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error deleting user",
                    data: null,
                };
            }
            const result: ResponseType<null> = await response.json();
            return result;
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }

    async addUser(userRegister: UserRegister): Promise<ResponseType<null>> {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userRegister),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error adding user",
                    data: null,
                };
            }
            const result: ResponseType<null> = await response.json();
            return result;
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }

    async updateUserRole(
        id: string,
        role: string
    ): Promise<ResponseType<null>> {
        try {
            const response = await fetch(`/api/users/${id}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role }),
            });
            if (!response.ok) {
                return {
                    success: false,
                    message: "Error updating user role",
                    data: null,
                };
            }
            const result: ResponseType<null> = await response.json();
            return result;
        } catch {
            return {
                success: false,
                message: "An error occurred",
                data: null,
            };
        }
    }
}
