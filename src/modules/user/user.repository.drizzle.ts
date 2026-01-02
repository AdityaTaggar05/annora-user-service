// import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { db } from "../../configs/database";
import { UserRepository } from "./user.repository";
import { User } from "./user.types";
import { users } from "./user.schema";

// const db = drizzle(pool);

export class DrizzleUserRepository implements UserRepository {

    private toDomainUser(row: any): User {
        return {
            id: row.id,
            username: row.username,
            name: row.name,
            age: row.age,
            ...(row.avatarUrl !== undefined && { avatarUrl: row.avatarUrl }),
            ...(row.bio !== undefined && {bio: row.bio}),
            isActive: row.isActive,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }
    }

    async create(user: User): Promise<User> {
        await db.insert(users).values(user)

        return user
    }

    async findById(id: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id,id))

        return result[0] ? this.toDomainUser(result[0]) : null
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            const result = await db.select().from(users).where(eq(users.username,username))        

            return result[0] ? this.toDomainUser(result[0]) : null
        }catch (err: any) {
            console.error("DB ERROR:",err)
            throw err
        }
    }

    async update(id: string, updates: Partial<User>): Promise<User> {
        const updated = await db.update(users).set({...updates, updatedAt: new Date()}).where(eq(users.id,id)).returning()

        return this.toDomainUser(updated)
    }

    async deactivate(id: string): Promise<void> {
        await db.update(users).set({isActive:false}).where(eq(users.id,id))
    }
}