import {
    IsDefined,
    IsInt,
    Min,
    ValidateNested,
} from 'class-validator'
import { AbstractFilter } from './Filters/AbstractFilter'

export class CommonIndexRequest {
    static readonly defaultPage: number = 1;
    static readonly defaultLimit: number = 5;

    @IsDefined()
    @IsInt()
    @Min(1)
    page: number;

    @IsDefined()
    @IsInt()
    @Min(1)
    limit: number;

    @ValidateNested()
    filter: AbstractFilter;

    constructor(page: number, limit: number, filter: AbstractFilter) {
        this.setPage(page);
        this.setLimit(limit);
        this.filter = filter;
    }

    private setPage(page: number): void {
        if (!page) {
            this.page = CommonIndexRequest.defaultPage;
            return;
        }

        this.page = page;
    }

    private setLimit(limit: number): void {
        if (!limit) {
            this.limit = CommonIndexRequest.defaultLimit;
            return;
        }

        this.limit = limit;
    }
}
