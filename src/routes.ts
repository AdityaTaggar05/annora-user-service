import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes";
import { healthRouter } from "./modules/health/health.routes";

const router = Router();

router.get("/",(_req,resp)=>{
    resp.status(200).json({message:"Hello from the server"})
})
router.use("/users",createUserRouter())
router.use("/",healthRouter)

export default router;