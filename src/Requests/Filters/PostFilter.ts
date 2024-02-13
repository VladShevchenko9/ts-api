import {
    IsNumber,
    IsOptional, IsString, Length,
} from 'class-validator'
import { AbstractFilter } from './AbstractFilter'

export class PostFilter extends AbstractFilter {

    @IsOptional()
    @IsString()
    @Length(3, 255)
    title: string | null = null;

    @IsOptional()
    @IsString()
    @Length(3, 255)
    content: string | null = null;

    @IsOptional()
    @IsNumber()
    user_id: number | null = null;
}
