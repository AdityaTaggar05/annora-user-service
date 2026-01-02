import { Router } from "express";
import { HealthController } from "./health.controller";
import { ReadinessController } from "./readiness.controller";

export const healthRouter = Router()

const healthController = new HealthController()
const readinessController = new ReadinessController()

healthRouter.get("/health",healthController.health)
healthRouter.get("/ready",readinessController.ready)