import request from "supertest";
import { createApp } from "../../src/app";
import { startJwksServer } from "../utils/jwks-server";
import { generateTestJwt } from "../utils/jwt";

let app: ReturnType<typeof createApp>;
let jwksServer: any;

describe("User Service E2E", () => {
  beforeAll(async () => {
    jwksServer = await startJwksServer(4000);
    app = createApp();
  });

  afterAll(async () => {
    jwksServer.close();
  });

  it("creates a user successfully", async () => {
    const token = generateTestJwt("e2e-user-1");

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: `e2e_${Date.now()}`,
        name: "E2E User",
        age: 25,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "e2e-user-1");
  });

  it("enforces rate limiting", async () => {
    const token = generateTestJwt("e2e-user-rl");

    for (let i = 0; i < 3; i++) {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: `rl_${Date.now()}_${i}`,
          name: "Rate Test",
          age: 20,
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

  it("health endpoint works", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("readiness endpoint works", async () => {
    const res = await request(app).get("/ready");
    expect([200, 503]).toContain(res.status);
  });
});
