import { id } from './../../../node_modules/effect/src/Fiber';
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDTO, UpdateUserDTO } from "./user.dtos";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async createUser(req: Request, resp: Response) {
        try {
            const dto: CreateUserDTO = req.body;
            const user = await this.userService.createUser(dto)

            return resp.status(201).json(user)
        } catch (err: any){
            return resp.status(400).json({message: err.message})
        }
    }

    async getUserById(req: Request, resp: Response) {
        try {
            if (!req.params.id)
                throw new Error("UserId isn't specified")
            const user = await this.userService.getUserById(req.params.id)
            if(!user)
                return resp.status(404).json({message: "User not found"})

            return resp.status(200).json(user)
        }catch (err :any) {
            resp.status(500).json({message: "Internal Server Error"})
        }
    }

    async updateUser(req: Request, resp: Response) {
        try {
            const dto: UpdateUserDTO = req.body
            if (!req.params.id)
                throw new Error("Missing UserId")
            const updated = await this.userService.updateUser(req.params.id,dto)
            return resp.status(204).json(updated)
        }catch (err: any) {
            return resp.status(400).json({message: err.message})
        }
    }

    async deactivateUser(req: Request, resp: Response) {
        try {
            if (!req.params.id)
                throw new Error("UserId not found")
            await this.userService.deactivateUser(req.params.id)
            return resp.status(204).send()
        }catch (err: any) {
            return resp.status(404).json({message: err.message})
        }
    }
}