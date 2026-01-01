export interface User {
    id: string,
    username: string,
    name: string,
    age: number,
    avatarUrl?: string,
    bio?: string,
    
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}