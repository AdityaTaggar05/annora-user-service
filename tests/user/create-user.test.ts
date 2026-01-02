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

afterAll(() => {
  jwksServer.close();
});

describe("POST /users", () => {
  it("creates a user when authenticated", async () => {
    const token = generateTestJwt("user-123");

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "parth",
        name: "Parth",
        age: 22,
      });

    expect(res.status).toBe(201);
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post("/users").send({
      username: "x",
      name: "X",
      age: 22,
    });

    expect(res.status).toBe(401);
  });

  it("rejects invalid payload", async () => {
    const token = generateTestJwt("user-456");

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "x",
        age: 10,
      });

    expect(res.status).toBe(400);
  });
});
