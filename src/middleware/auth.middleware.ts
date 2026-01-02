import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { AuthenticatedRequest } from "../types/auth.types";

const client = jwksClient({
    jwksUri: process.env.AUTH_JWKS_URL!,
})

function getKey(header: any, callback: any) {
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
    const authHeader = req.headers.authorization
    if(!authHeader)
        return resp.status(401).json({message: "Missing Authorization header"})

    const token = authHeader.replace("Bearer ","")

    jwt.verify(token,getKey,{algorithms:["RS256"]}, (err, decoded)=>{
        if (err)
            return resp.status(401).json({message: "Invalid token"})

        const payload = decoded as JwtPayload
        if (!payload.sub)
            return resp.status(401).json({message: "Invalid token payload"})

        req.id = payload.sub
        next();
    })
}