import { IsJSON } from 'class-validator'

export class FilterRequest {
    @IsJSON()
    filterJsonStr: string;

    constructor(filterJsonStr: string | undefined) {
        this.setFilter(filterJsonStr);
    }

    private setFilter(filterJsonStr: string | undefined): void {
        if (!filterJsonStr) {
            this.filterJsonStr = JSON.stringify({});

            return;
        }

        this.filterJsonStr = filterJsonStr;
    }

    get filter(): Record<string, any> {
        return JSON.parse(this.filterJsonStr);
    }
}
