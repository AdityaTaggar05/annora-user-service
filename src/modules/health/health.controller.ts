import { Request, Response } from "express";

export class HealthController {
    health = (_req: Request, resp: Response) => {
        resp.status(200).json({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        })
    }
}