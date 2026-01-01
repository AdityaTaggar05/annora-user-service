import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes";
import { PrismaUserRepository } from "./modules/user/user.repository.prisma";
import { UserServiceImpl } from "./modules/user/user.service.impl";

const router = Router();

const userService = new UserServiceImpl(new PrismaUserRepository());

router.use("/users",createUserRouter(userService))

export default router;