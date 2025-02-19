import { ResponseType } from "../ResponseType";
import { User, UserRegister } from "../user";

export interface UserServices {
    getUsers(): Promise<ResponseType<User[] | null>>;
    deleteUser(id: string): Promise<ResponseType<null>>;
    addUser(userRegister: UserRegister): Promise<ResponseType<null>>;
    updateUserRole(id: string, role: string): Promise<ResponseType<null>>;
}
