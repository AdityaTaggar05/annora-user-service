import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDTO, UpdateUserDTO } from "./user.dtos";
import { AuthenticatedRequest } from "../../types/auth.types";

export class UserController {
    constructor(private readonly userService: UserService) {}

    createUser = async (req: AuthenticatedRequest, resp: Response) => {
        const dto: CreateUserDTO = {
            id: req.id!,
            ...req.body
        }
        const user = await this.userService.createUser(dto)
        resp.status(201).json(user)
    }

    getUserById = async (req: AuthenticatedRequest, resp: Response)=> {
      const targetUser = req.params.id
      const authUser = req.id
      if (!targetUser){
        resp.status(400).json({message: "UserId missing in params"})
        return
      }

      const isOwner = authUser === targetUser

      const user = isOwner ? 
      await this.userService.getPrivateUserById(targetUser) 
      : await this.userService.getPublicUserById(targetUser)

      resp.status(200).json(user)
    }

    updateUser = async (req: AuthenticatedRequest, resp: Response)=> {
        const targetUser = req.params.id

        if (!targetUser){
            resp.status(400).json({message:"UserId missing in params"})
            return
        }

        if (req.id !== targetUser){
            resp.status(403).json({message: "Forbidden"})
            return
        }

        const user = await this.userService.updateUser(targetUser,req.body)
        resp.status(200).send(user)
    }

    async deactivateUser(req: AuthenticatedRequest, resp: Response) {
        const targetUser = req.params.id
        if (!targetUser){
            resp.status(400).json({message: "UserId missing in params"})
            return
        }

        if (req.id !== targetUser) {
            resp.status(403).json({message: "Forbidden"})
            return
        }

        await this.userService.deactivateUser(targetUser)
        resp.status(204).send()
    }
}