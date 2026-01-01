/// <reference types="jest" />

import { UserServiceImpl } from "../../src/modules/user/user.service.impl";
import { UserRepository } from "../../src/modules/user/user.repository";
import { User } from "../../src/modules/user/user.types";

describe("UserServiceImpl", () => {
  let service: UserServiceImpl;
  let repo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    };

    service = new UserServiceImpl(repo);
  });

  const baseUser: User = {
    id: "u1",
    username: "parth",
    name: "Parth",
    age: 22,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("creates a user successfully", async () => {
    repo.findByUsername.mockResolvedValue(null);
    repo.create.mockResolvedValue(baseUser);

    const result = await service.createUser({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result.username).toBe("parth");
  });

  it("throws error if username already exists", async () => {
    repo.findByUsername.mockResolvedValue(baseUser);

    await expect(
      service.createUser({
        id: "u2",
        username: "parth",
        name: "Someone",
        age: 30,
      })
    ).rejects.toThrow("Username already exists");
  });

  it("returns public user by id", async () => {
    repo.findById.mockResolvedValue(baseUser);

    const user = await service.getUserById("u1");

    expect(user).not.toHaveProperty("createdAt");
    expect(user?.username).toBe("parth");
  });

  it("returns null if user is inactive", async () => {
    repo.findById.mockResolvedValue({ ...baseUser, isActive: false });

    const user = await service.getUserById("u1");

    expect(user).toBeNull();
  });

  it("updates user profile", async () => {
    repo.findById.mockResolvedValue(baseUser);
    repo.update.mockResolvedValue({ ...baseUser, name: "Updated" });

    const updated = await service.updateUser("u1", { name: "Updated" });

    expect(updated.name).toBe("Updated");
  });

  it("deactivates user", async () => {
    repo.findById.mockResolvedValue(baseUser);
    repo.deactivate.mockResolvedValue();

    await service.deactivateUser("u1");

    expect(repo.deactivate).toHaveBeenCalledWith("u1");
  });
});
