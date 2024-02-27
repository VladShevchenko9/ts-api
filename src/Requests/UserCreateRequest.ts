import {
    IsDefined,
    IsStrongPassword,
} from 'class-validator'
import { UserBaseRequest } from './UserBaseRequest'

export class UserCreateRequest extends UserBaseRequest {
    @IsDefined()
    @IsStrongPassword()
    password: string | null = null;
}
