import {
    Length,
    IsString,
    IsDefined,
} from 'class-validator'
import { AbstractRequest } from './AbstractRequest'

export class PostRequest extends AbstractRequest {
    @IsDefined()
    @IsString()
    @Length(3, 255)
    title: string | null = null;

    @IsDefined()
    @IsString()
    @Length(3, 255)
    content: string | null = null;
}
