export interface CreateUserDTO {
    id: string, //injected, not client-provided
    username: string,
    name: string,
    age: number,
    avatarUrl?: string,
    bio?: string
}

export interface UpdateUserDTO {
    name?: string,
    avatarUrl?: string,
    bio?: string,
    age?: number
}

export interface PublicUserDTO {
    id: string,
    name: string,
    username: string,
    avatarUrl?: string,
    bio?: string,
    age: number
}

export interface PrivateUserDTO extends PublicUserDTO {
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}