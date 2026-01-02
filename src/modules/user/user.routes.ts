import { Router } from "express";
import { UserController } from "./user.controller";
import { userService } from "./user.module";
import { authMiddleware } from "../../middleware/auth.middleware";
import { zodValidate } from "../../middleware/zod-validate.middleware";
import { createUserZodSchema, updateUserZodSchema, userIdParamZodSchema } from "./user.zod";
import { rateLimitCreateUser } from "../../middleware/rate-limit.middleware";

export const createUserRouter = (): Router =>{
    const router = Router();
    const controller = new UserController(userService)

    router.get("/hello",(_req,resp)=> {
        resp.status(200).json({message:"Hello from user router"})
    })
    router.post("/",authMiddleware,rateLimitCreateUser,zodValidate(createUserZodSchema),controller.createUser)
    router.get("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),controller.getUserById)
    router.patch("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),zodValidate(updateUserZodSchema),controller.updateUser)
    router.delete("/:id",authMiddleware,zodValidate(userIdParamZodSchema,"params"),controller.deactivateUser)

    return router
}