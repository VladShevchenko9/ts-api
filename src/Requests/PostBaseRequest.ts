import {
    Length,
    IsString,
    IsDefined,
    IsNumber,
} from 'class-validator'
import { AbstractRequest } from './AbstractRequest'

export class PostBaseRequest extends AbstractRequest {
    @IsDefined()
    @IsString()
    @Length(3, 255)
    title: string | null = null;

    @IsDefined()
    @IsString()
    @Length(3, 255)
    content: string | null = null;

    @IsDefined()
    @IsNumber()
    user_id: number | null = null;
}
