import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(
    path.join(__dirname,"/keys/test-private.pem"),
    "utf-8"
)

export function generateTestJwt(userId: string) {
    return jwt.sign(
        {},
        privateKey,
        {
            algorithm: "RS256",
            subject: userId,
            expiresIn: "1hr",
            keyid: "test-key-1",
        }
    )
}