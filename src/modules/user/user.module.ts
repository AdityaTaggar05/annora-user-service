import { UserServiceImpl } from "./user.service.impl";
import { DrizzleUserRepository } from "./user.repository.drizzle";

const userRepository = new DrizzleUserRepository();
export const userService = new UserServiceImpl(userRepository);
