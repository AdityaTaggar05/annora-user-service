export type Gender = 
    | "male"
    | "female"
    | "non_binary"
    | "other"
    | "prefer_not_to_say";

export interface User {
    id: string,
    username: string,
    name: string,
    age: number,
    avatarUrl?: string,
    bio?: string,
    gender?: Gender,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}