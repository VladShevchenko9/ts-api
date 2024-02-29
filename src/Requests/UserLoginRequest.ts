import {
    IsDefined,
    IsEmail,
    IsStrongPassword,
} from 'class-validator'

export class UserLoginRequest {
    @IsDefined()
    @IsEmail()
    email: string | null = null;

    @IsDefined()
    @IsStrongPassword()
    password: string | null = null;
}
