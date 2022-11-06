import { hash } from "bcryptjs";

export class User {
  private _password: string;

  constructor(
    private readonly _email: string,
    private readonly _login: string
  ) {}

  get email() {
    return this._email;
  }

  get login() {
    return this._login;
  }

  get password() {
    return this._password;
  }

  public async setPassword(password: string, salt: number) {
    this._password = await hash(password, salt);
  }
}
