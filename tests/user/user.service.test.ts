import { UserServiceImpl } from "../../src/modules/user/user.service.impl";
import { UserRepository } from "../../src/modules/user/user.repository";
import { User } from "../../src/modules/user/user.types";

describe("UserServiceImpl", () => {
  let service: UserServiceImpl;
  let repo: jest.Mocked<UserRepository>;

  const baseUser: User = {
    id: "u1",
    username: "parth",
    name: "Parth",
    age: 22,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserServiceImpl(repo);
  });

  it("creates a user when username is unique", async () => {
    repo.findByUsername.mockResolvedValue(null);
    repo.create.mockResolvedValue(baseUser);

    const user = await service.createUser({
      id: "u1",
      username: "parth",
      name: "Parth",
      age: 22,
    });

    expect(repo.create).toHaveBeenCalled();
    expect(user.username).toBe("parth");
  });

  it("throws if username already exists", async () => {
    repo.findByUsername.mockResolvedValue(baseUser);

    await expect(
      service.createUser({
        id: "u2",
        username: "parth",
        name: "Someone",
        age: 30,
      })
    ).rejects.toThrow();
  });

  it("returns public user by id", async () => {
    repo.findById.mockResolvedValue(baseUser);

    const user = await service.getPublicUserById("u1");

    expect(user).not.toHaveProperty("createdAt");
    expect(user).not.toHaveProperty("updatedAt");
    expect(user?.username).toBe("parth");
  });

  it("throws NotFoundError if public user is inactive", async () => {
    repo.findById.mockResolvedValue({ ...baseUser, isActive: false });

    await expect(
      service.getPublicUserById("u1")
    ).rejects.toThrow("User not found");
  });

  it("returns private user for owner", async () => {
    repo.findById.mockResolvedValue(baseUser);

    const user = await service.getPrivateUserById("u1");

    expect(user?.createdAt).toBeInstanceOf(Date);
    expect(user?.updatedAt).toBeInstanceOf(Date);
  });

  it("throws NotFoundError if private user is inactive", async () => {
    repo.findById.mockResolvedValue({ ...baseUser, isActive: false });

    await expect(
      service.getPrivateUserById("u1")
    ).rejects.toThrow("User not found");
  });
});
