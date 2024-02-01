import {
    IsDefined,
    IsInt,
    Min,
} from 'class-validator'

export class CommonIndexRequest {
    @IsDefined()
    @IsInt()
    @Min(1)
    page: number | null = null;
}
