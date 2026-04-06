import { CreateUserDTO, PrivateUserDTO, PublicUserDTO, UpdateUserDTO } from "./user.dtos";
import { User } from "./user.types";

export interface UserService {
    createUser(dto: CreateUserDTO): Promise<PrivateUserDTO>;
    getPrivateUserById(id:string): Promise<PrivateUserDTO>
    getPublicUserById(id: string): Promise<PublicUserDTO>
    getPublicUserByUsername(username: string): Promise<PublicUserDTO>
    getPrivateUserByUsername(username: string): Promise<PrivateUserDTO>
    updateUser(id: string, dto: UpdateUserDTO): Promise<PrivateUserDTO>;
    deactivateUser(id: string): Promise<void>
}