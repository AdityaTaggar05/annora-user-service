/// <reference types="jest" />

import { UserController } from "../../src/modules/user/user.controller";
import { UserService } from "../../src/modules/user/user.service";
import { Request, Response } from "express";

describe("UserController", () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;
  let res: Partial<Response>;

  beforeEach(() => {
    service = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deactivateUser: jest.fn(),
    };

    controller = new UserController(service);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it("returns user on getUserById", async () => {
    service.getUserById.mockResolvedValue({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    });

    const req = {
        params: { id: "u1" },
    } as unknown as Request;


    await controller.getUserById(req, res as Response);

    expect(res.json).toHaveBeenCalled();
  });

  it("returns 404 if user not found", async () => {
    service.getUserById.mockResolvedValue(null);

    const req = {
        params: { id: "x" },
    } as unknown as Request;


    await controller.getUserById(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("creates a user", async () => {
    service.createUser.mockResolvedValue({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const req = {
      body: {
        id: "u1",
        username: "parth",
        name: "Parth",
        age: 22,
      },
    } as Request;

    await controller.createUser(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
