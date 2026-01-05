import { Gender } from "./user.types"

export interface CreateUserDTO {
    id: string, //injected, not client-provided
    username: string,
    name: string,
    age: number,
    avatarUrl?: string,
    bio?: string
    gender: Gender
}

export interface UpdateUserDTO {
    name?: string,
    avatarUrl?: string,
    bio?: string,
    age?: number,
    gender: Gender
}

export interface PublicUserDTO {
    id: string,
    name: string,
    username: string,
    avatarUrl?: string,
    bio?: string,
    gender: Gender,
    age: number
}

export interface PrivateUserDTO extends PublicUserDTO {
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}