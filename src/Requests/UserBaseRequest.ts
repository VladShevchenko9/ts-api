import {
    Length,
    IsString,
    IsDefined,
    IsEmail,
    IsMobilePhone,
} from 'class-validator'
import { AbstractRequest } from './AbstractRequest'

export class UserBaseRequest extends AbstractRequest {
    @IsDefined()
    @IsString()
    @Length(3, 255)
    first_name: string | null = null;

    @IsDefined()
    @IsString()
    @Length(3, 255)
    last_name: string | null = null;

    @IsDefined()
    @IsEmail()
    email: string | null = null;

    @IsDefined()
    @IsMobilePhone('uk-UA')
    phone_number: string | null = null;
}
