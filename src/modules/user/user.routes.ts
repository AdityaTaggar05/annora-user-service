import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

export const createUserRouter = (userService: UserService): Router =>{
    const router = Router();
    const controller = new UserController(userService)

    router.get("/hello",(_req,resp)=> {
        resp.status(200).json({message:"Hello from user router"})
    })
    router.post("/",controller.createUser)
    router.get("/:id",controller.getUserById)
    router.patch("/:id",controller.updateUser)
    router.delete("/:id",controller.deactivateUser)

    return router
}