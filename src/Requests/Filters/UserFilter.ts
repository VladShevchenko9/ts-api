import {
    IsOptional, IsString, Length,
} from 'class-validator'
import { AbstractFilter } from './AbstractFilter'

export class UserFilter extends AbstractFilter {

    @IsOptional()
    @IsString()
    @Length(3, 255)
    first_name: string | null = null;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    last_name: string | null = null;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    email: string | null = null;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    phone_number: string | null = null;
}
