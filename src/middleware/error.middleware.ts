import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export function errorMiddleware(
    err: unknown,
    _req: Request,
    resp: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return resp.status(err.statusCode).json({
            message: err.message
        })
    }

    console.error("Unhandled error:",err)

    return resp.status(500).json({
        message: "Something went wrong"
    })
}