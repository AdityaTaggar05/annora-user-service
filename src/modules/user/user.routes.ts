import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { authMiddleware } from "../../middleware/auth.middleware";
import { zodValidate } from "../../middleware/zod-validate.middleware";
import { createUserZodSchema, updateUserZodSchema, userIdParamZodSchema } from "./user.zod";

export const createUserRouter = (userService: UserService): Router =>{
    const router = Router();
    const controller = new UserController(userService)

    router.get("/hello",(_req,resp)=> {
        resp.status(200).json({message:"Hello from user router"})
    })
    router.post("/",authMiddleware,zodValidate(createUserZodSchema),controller.createUser)
    router.get("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),controller.getUserById)
    router.patch("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),zodValidate(updateUserZodSchema),controller.updateUser)
    router.delete("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),controller.deactivateUser)

    return router
}