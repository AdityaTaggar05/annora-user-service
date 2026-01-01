import { User } from "./user.types";

export interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User>;
    deactivate(id: string): Promise<void>;
}