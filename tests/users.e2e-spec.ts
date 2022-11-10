import { App } from "../src/app";
import { boot } from "../src/main";

import request from "supertest";

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

afterAll(() => {
  application.close();
});

describe("Users Controller", () => {
  const EMAIL = "alex@ru.ru";
  const NAME = "alexandr";
  const PASSWORD = "12345";

  test("ошибка регистрации - отсутствует поле name", async () => {
    const res = await request(application.app)
      .post("/users/register")
      .send({ email: EMAIL, password: PASSWORD });

    expect(res.statusCode).toEqual(422);
    expect(res.body[0].property).toEqual("name");
  });

  test("Логин - успешно", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: EMAIL, password: PASSWORD });

    expect(res.body.token).not.toBeUndefined();
  });

  test("Логин - ошибка авторизации", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: EMAIL, password: PASSWORD + "1" });

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual("Неверные логин или пароль!");
  });

  test("Информация о пользователе - ошибка авторизации", async () => {
    const login = await request(application.app)
      .post("/users/login")
      .send({ email: EMAIL, password: PASSWORD + "1" });

    const userInfo = await request(application.app)
      .get("/users/info")
      .set({ Authorization: `Bearer ${login.body.token}` });

    expect(userInfo.statusCode).toEqual(401);
    expect(userInfo.body.message).toEqual("Пользователь не авторизован");
  });

  test("Информация о пользователе - успешно", async () => {
    const login = await request(application.app)
      .post("/users/login")
      .send({ email: EMAIL, password: PASSWORD });

    const userInfo = await request(application.app)
      .get("/users/info")
      .set({ Authorization: `Bearer ${login.body.token}` });

    expect(userInfo.statusCode).toEqual(200);
    expect(userInfo.body).toEqual({
      email: EMAIL,
      name: NAME,
      id: 6,
    });
  });
});
