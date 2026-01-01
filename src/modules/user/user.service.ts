import { CreateUserDTO, PrivateUserDTO, PublicUserDTO, UpdateUserDTO } from "./user.dtos";
import { User } from "./user.types";

export interface UserService {
    createUser(dto: CreateUserDTO): Promise<PrivateUserDTO>;
    getUserById(id: string): Promise<PublicUserDTO | null>
    updateUser(id: string, dto: UpdateUserDTO): Promise<PrivateUserDTO>;
    deactivateUser(id: string): Promise<void>
}