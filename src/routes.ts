import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes";
import { UserServiceImpl } from "./modules/user/user.service.impl";
import { DrizzleUserRepository } from "./modules/user/user.repository.drizzle";

const router = Router();

const userService = new UserServiceImpl(new DrizzleUserRepository());

router.get("/hello",(_req,resp)=>{
    resp.status(200).json({message:"Hello from the server"})
})
router.use("/users",createUserRouter(userService))

export default router;