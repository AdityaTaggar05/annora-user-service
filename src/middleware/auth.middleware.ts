import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { AuthenticatedRequest } from "../types/auth.types";

const jwksUri = process.env.AUTH_JWKS_URL || process.env.JWKS_URI;

const client = jwksUri
    ? jwksClient({ jwksUri })
    : null

function getKey(header: any, callback: any) {
    if (!client) {
        callback(new Error("JWKS client is not configured"))
        return
    }

    client.getSigningKey(header.kid, function (err,key){
        if (err){
            callback(err)
            return err
        }

        const signingKey = key?.getPublicKey()
        callback(null,signingKey)
    })
}

export function authMiddleware(
    req: AuthenticatedRequest,
    resp: Response,
    next: NextFunction
) {
    if (!jwksUri) {
        console.error("AUTH_JWKS_URL/JWKS_URI is not configured");
        return resp.status(500).json({ message: "Auth configuration error" });
    }

    const authHeader = req.headers.authorization
    if(!authHeader)
        return resp.status(401).json({message: "Missing Authorization header"})

    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i)
    if (!bearerMatch)
        return resp.status(401).json({message: "Invalid Authorization header format"})

    const token = (bearerMatch[1] || "").trim()

    jwt.verify(token,getKey,{algorithms:["RS256"]}, (err, decoded)=>{
        if (err){
            const tokenKid = jwt.decode(token, { complete: true }) as { header?: { kid?: string } } | null
            console.error("JWT verify failed", {
                reason: err.message,
                jwksUri,
                kid: tokenKid?.header?.kid,
            })

            const isProd = process.env.NODE_ENV === "production"
            return resp.status(401).json({
                message: "Invalid token",
                ...(isProd ? {} : { reason: err.message }),
            })
        }

        const payload = decoded as JwtPayload
        if (!payload.sub)
            return resp.status(401).json({message: "Invalid token payload"})

        req.userId = payload.sub
        next();
    })
}