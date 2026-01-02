import { ZodTypeAny } from "zod/v3";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/http-errors";

export const zodValidate = (schema: ZodTypeAny, property: "body" | "params" = "body") => 
(req: Request, _resp: Response, next: NextFunction)=> {
    const result = schema.safeParse(req[property])

    if (!result.success)
        throw new BadRequestError("Validation Failed")

    req[property] = result.data
    next();
}