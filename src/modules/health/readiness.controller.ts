import { Request, Response } from "express";
import { db } from "../../configs/database";
import { sql } from "drizzle-orm";

export class ReadinessController {
    ready = async (_req: Request, resp: Response) => {
        try {
            await db.execute(sql`SELECT 1`)

            resp.status(200).json({
                status: "ready",
                timestamp: new Date().toISOString(),
            })
        }catch (err) {
            resp.status(503).json({
                status: "not_ready",
                reason: "database_unreachable"
            })
        }
    }
}