import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: "Неверный формат почты" })
  email: string;

  @IsString({ message: "Обязательное поле" })
  name: string;

  @IsString({ message: "Обязательное поле" })
  password: string;
}
