/// <reference types="jest" />

import { UserController } from "../../src/modules/user/user.controller";
import { UserService } from "../../src/modules/user/user.service";
import { Response } from "express";
import { AuthenticatedRequest } from "../../src/types/auth.types";

describe("UserController", () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;
  let res: Partial<Response>;

  beforeEach(() => {
    service = {
      getPublicUserById: jest.fn(),
      getPrivateUserById: jest.fn(),
      updateUser: jest.fn(),
      deactivateUser: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(service);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it("returns public user when requester is not owner", async () => {
    service.getPublicUserById.mockResolvedValue({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    } as any);

    const req: Partial<AuthenticatedRequest> = {
      params: { id: "u1" },
      userId: "someone-else",
    };

    await controller.getUserById(req as AuthenticatedRequest, res as Response);

    expect(service.getPublicUserById).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("returns private user when requester is owner", async () => {
    service.getPrivateUserById.mockResolvedValue({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const req: Partial<AuthenticatedRequest> = {
      params: { id: "u1" },
      userId: "u1",
    };

    await controller.getUserById(req as AuthenticatedRequest, res as Response);

    expect(service.getPrivateUserById).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("creates a user using auth userId", async () => {
    service.createUser.mockResolvedValue({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    } as any);

    const req = {
      userId: "u1",
      body: {
        username: "parth",
        name: "Parth",
        age: 22,
      },
    } as AuthenticatedRequest;

    await controller.createUser(req, res as Response);

    expect(service.createUser).toHaveBeenCalledWith({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
