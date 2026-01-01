import type { UserRepository } from "./user.repository";
import type { User } from "./user.types";
import { prisma } from "../../configs/database";

export class PrismaUserRepository implements UserRepository {

    async create(user: User): Promise<User> {
        const created = await prisma.user.create({
            data:{
                id: user.id,
                username: user.username,
                name: user.name,
                age: user.age,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })

        return this.toDomain(created);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({where: {id}})

        return user ? this.toDomain(user) : null
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: {username}})

        return user ? this.toDomain(user) : null
    }

    async update(id: string, updates: Partial<User>): Promise<User> {
        const updated = await prisma.user.update({
            where: {id},
            data:{
                name: updates.name,
                age: updates.name,
                avatarUrl: updates.avatarUrl,
                bio: updates.bio,
                isActive: updates.isActive
            }
        })

        return this.toDomain(updated)
    }

    async deactivate(id: string): Promise<void> {
        await prisma.user.update({
            where: {id},
            data: {isActive: false}
        })
    }

    private toDomain(prismaUser: any): User {
        return {
            id: prismaUser.id,
            username: prismaUser.username,
            name: prismaUser.name,
            age: prismaUser.age,
            avatarUrl: prismaUser.avatarUrl ?? undefined,
            bio: prismaUser.bio ?? undefined,
            isActive: prismaUser.isActive,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt
        }
    }
}