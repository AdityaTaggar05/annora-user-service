import { Request, Response, NextFunction } from "express";
import { ipRateLimiter, userRateLimiter } from "./rate-limiters";
import { AuthenticatedRequest } from "../types/auth.types";
import { BadRequestError } from "../errors/http-errors";

export const rateLimitCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "infra") {
    return next();
  }

  try {

    if (!req.ip)
        throw new BadRequestError("Ip missing in the request")

    await ipRateLimiter.consume(req.ip);

    const authReq = req as AuthenticatedRequest;
    if (authReq.userId) {
      await userRateLimiter.consume(authReq.userId);
    }

    next();
  } catch {
    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }
};
