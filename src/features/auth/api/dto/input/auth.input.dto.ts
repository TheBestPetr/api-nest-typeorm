import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import {
  emailConfirmationCodeIsExist,
  emailResendingIsEmailConfirmed,
  loginOrEmailIsExist,
  passwordRecoveryCodeIsExist,
} from '../../../../../infrastructure/decorators/auth.custom.decorator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AuthInputLoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;
}

export class AuthInputRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(loginOrEmailIsExist)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Validate(loginOrEmailIsExist)
  email: string;
}

export class AuthInputEmailConfirmationDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(emailConfirmationCodeIsExist)
  code: string;
}

export class AuthInputEmailResendingDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Validate(emailResendingIsEmailConfirmed)
  email: string;
}

export class AuthInputEmailPasswordRecoveryDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AuthInputNewPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Validate(passwordRecoveryCodeIsExist)
  recoveryCode: string;
}
