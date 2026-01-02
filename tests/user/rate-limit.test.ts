import request from "supertest";
import { createApp } from "../../src/app";
import { generateTestJwt } from "../utils/jwt";
import { startJwksServer } from "../utils/jwks-server";

let jwksServer: any;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  jwksServer = await startJwksServer(4000);
  app = createApp();
});

afterAll(async () => {
  jwksServer.close();
});

describe("POST /users rate limiting (infra)", () => {
  it("returns 429 after exceeding limits", async () => {
    const token = generateTestJwt("rate-limit-user");

    for (let i = 0; i < 3; i++) {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: `user_${Date.now()}_${i}`,
          name: "Test",
          age: 22,
        });
    }

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "blocked_user",
        name: "Blocked",
        age: 22,
      });

    expect(res.status).toBe(429);
  });
});
