import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { User } from "./user.types";
import { CreateUserDTO, PrivateUserDTO, PublicUserDTO, UpdateUserDTO } from "./user.dtos";
import { ConflitError, NotFoundError } from "../../errors/http-errors";

export class UserServiceImpl implements UserService {
    private toPublicDTO(user: User): PublicUserDTO {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            age: user.age,
            ...(user.avatarUrl !== undefined && { avatarUrl: user.avatarUrl }),
            ...(user.bio !== undefined && { bio: user.bio }),
        }
    }

    private toPrivateDTO(user: User): PrivateUserDTO {
        return {
            ...this.toPublicDTO(user),
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    constructor(private readonly userRepo: UserRepository) {}

    async createUser(dto: CreateUserDTO): Promise<PrivateUserDTO> {

        console.log("Service recieved DTO:",dto)

        const existing = await this.userRepo.findByUsername(dto.username)

        if (existing)
            throw new ConflitError("Username already exists")

        const now = new Date()

        const user: User = {
            id: dto.id,
            username: dto.username,
            name: dto.name,
            age: dto.age,
            ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
            ...(dto.bio !== undefined && { bio: dto.bio }),
            isActive: true,
            createdAt: now,
            updatedAt: now
        }

        const created = await this.userRepo.create(user);

        return this.toPrivateDTO(created)
    }

    async getPublicUserById(id: string): Promise<PublicUserDTO> {
        const user = await this.userRepo.findById(id)
        if(!user || !user.isActive)
            throw new NotFoundError("User not found")
        return this.toPublicDTO(user)
    }

    async getPrivateUserById(id: string): Promise<PrivateUserDTO> {
        const user = await this.userRepo.findById(id)
        if (!user || !user.isActive)
            throw new NotFoundError("User not found")
        
        return this.toPrivateDTO(user)
    }

    async updateUser(id: string, dto: UpdateUserDTO): Promise<PrivateUserDTO> {
        const user = await this.userRepo.findById(id)
        if (!user || !user.isActive)
            throw new NotFoundError("User not found")

        const updated = await this.userRepo.update(id,{...dto})

        return this.toPrivateDTO(updated)
    }

    async deactivateUser(id: string): Promise<void> {
        const user = await this.userRepo.findById(id)
        if (!user)
            throw new NotFoundError("User not found")

        await this.userRepo.deactivate(id)
    }
}