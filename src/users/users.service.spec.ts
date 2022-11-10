import { Container } from "inversify";
import "reflect-metadata";

import { TYPES } from "../bindingTypes";

// Services
import { UsersService } from "./users.service";

// Interfaces
import { ConfigServiceInterface } from "config/config.service.interface";
import { UsersRepositoryInterface } from "./users.repository.interface";
import { UsersServiceInterface } from "./users.service.interface";
import { LoggerInterface } from "../logger/logger.interface";

// Model
import { UserModel } from "@prisma/client";

// Entity
import { User } from "./user.entity";

const ConfigServiceMock: ConfigServiceInterface = {
  get: jest.fn(),
};

const UsersRepositoryMock: UsersRepositoryInterface = {
  find: jest.fn(),
  create: jest.fn(),
};

const LoggerServiceMock: LoggerInterface = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

let configService: ConfigServiceInterface;
let usersRepository: UsersRepositoryInterface;
let loggerService: LoggerInterface;
let userService: UsersServiceInterface;

const container = new Container();

beforeAll(() => {
  // prepare DI
  container.bind<UsersServiceInterface>(TYPES.USER_SERVICE).to(UsersService);
  container
    .bind<LoggerInterface>(TYPES.LOGGER)
    .toConstantValue(LoggerServiceMock);
  container
    .bind<ConfigServiceInterface>(TYPES.CONFIG_SERVICE)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<UsersRepositoryInterface>(TYPES.USERS_REPOSITORY)
    .toConstantValue(UsersRepositoryMock);

  // set services
  configService = container.get<ConfigServiceInterface>(TYPES.CONFIG_SERVICE);
  usersRepository = container.get<UsersRepositoryInterface>(
    TYPES.USERS_REPOSITORY
  );
  loggerService = container.get<LoggerInterface>(TYPES.LOGGER);
  userService = container.get<UsersServiceInterface>(TYPES.USER_SERVICE);
});

function implementUserInfo(USER_ID: number) {
  return (user: UserModel) => ({
    email: user.email,
    name: user.name,
    password: user.password,
    id: USER_ID,
  });
}

describe("usersService", () => {
  const EMAIL = "admin@example.com";
  const NAME = "Alexandr";
  const PASSWORD = "1233214%";
  const USER_ID = 1;

  describe("create", () => {
    test("переданы данные пользователя -> id должен быть равен замоканному в методе 1", async () => {
      usersRepository.create = jest
        .fn()
        .mockImplementationOnce(implementUserInfo(USER_ID));

      const createdUser = await userService.createUser({
        email: EMAIL,
        name: NAME,
        password: PASSWORD,
      });

      // @ts-ignore
      expect(createdUser.id).toBe(USER_ID);
    });

    test("переданы данные пользователя -> сохранены переданные email и name", async () => {
      usersRepository.create = jest
        .fn()
        .mockImplementationOnce(implementUserInfo(USER_ID));

      const createdUser = await userService.createUser({
        email: EMAIL,
        name: NAME,
        password: PASSWORD,
      });

      expect(createdUser?.email).toBe(EMAIL);
      expect(createdUser?.name).toBe(NAME);
    });

    test("переданы данные пользователя -> пароль захеширован, переданный пароль !== полученному", async () => {
      usersRepository.create = jest
        .fn()
        .mockImplementationOnce(implementUserInfo(USER_ID));

      const createdUser = await userService.createUser({
        email: EMAIL,
        name: NAME,
        password: PASSWORD,
      });

      expect(createdUser?.password).not.toEqual(PASSWORD);
    });
  });

  describe("validateUser", () => {
    test("передали корректные email и password -> true", async () => {
      const createdUser = new User(EMAIL, NAME);
      await createdUser.setPassword(PASSWORD, 10);

      usersRepository.find = jest.fn().mockResolvedValueOnce({
        id: USER_ID,
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
      });

      const result = await userService.validateUser({
        email: EMAIL,
        password: PASSWORD,
      });

      expect(result).toBeTruthy();
    });

    test("передали корректный email и неверный password -> in comparePassword: false", async () => {
      usersRepository.find = jest.fn().mockResolvedValueOnce({
        id: USER_ID,
        name: NAME,
        email: EMAIL,
        password: PASSWORD,
      });

      const result = await userService.validateUser({
        email: EMAIL,
        password: `${PASSWORD}123`,
      });

      expect(result).toBeFalsy();
    });

    test("передали некорректный email и верный password, метод find вернет null ->  false", async () => {
      usersRepository.find = jest.fn().mockResolvedValueOnce(null);

      const result = await userService.validateUser({
        email: EMAIL,
        password: `${PASSWORD}123`,
      });

      expect(result).toBeFalsy();
    });
  });
});
