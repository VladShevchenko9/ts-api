import {
    IsDefined,
    IsInt,
    Min,
} from 'class-validator'

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

    constructor(page: number, limit: number) {
        this.setPage(page);
        this.setLimit(limit);
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
