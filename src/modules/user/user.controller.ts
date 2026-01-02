import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDTO, UpdateUserDTO } from "./user.dtos";

export class UserController {
    constructor(private readonly userService: UserService) {}

    createUser = async (req: Request, resp: Response) => {
        const user = await this.userService.createUser(req.body)
        resp.status(201).json(user)
    }

    async getUserById(req: Request, resp: Response) {
        if (!req.params.id){
            resp.status(400).json({message: "UserId not found in the params"})
            throw new Error("UserId not found")
        }
        const user = await this.userService.getUserById(req.params.id)
        resp.status(200).json(user)
    }

    async updateUser(req: Request, resp: Response) {
        if (!req.params.id){
            resp.status(400).json({message: "UserId not mentioned in the params"})
            throw new Error("UserId not mentioned")
        }

        const user = await this.userService.updateUser(req.params.id,req.body)
        resp.status(200).json(user)
    }

    async deactivateUser(req: Request, resp: Response) {
        if (!req.params.id){
            resp.status(400).json({message: "UserId not mentioned in the params"})
            throw new Error("UserId not mentioned")
        }
        await this.userService.deactivateUser(req.params.id)
        return resp.status(204).send()
    }
}