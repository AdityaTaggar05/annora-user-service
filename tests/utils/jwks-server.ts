import express from "express";
import fs from "fs";
import { importSPKI, exportJWK } from "jose";

export async function startJwksServer(port = 4000) {
  const app = express();

  const publicKeyPem = fs.readFileSync(
    __dirname + "/keys/test-public.pem",
    "utf8"
  );

  const key = await importSPKI(publicKeyPem, "RS256");
  const jwk = await exportJWK(key);

  app.get("/.well-known/jwks.json", (_req, res) => {
    res.json({
      keys: [
        {
          ...jwk,
          kid: "test-key-1",
          use: "sig",
          alg: "RS256",
        },
      ],
    });
  });

  return app.listen(port);
}
