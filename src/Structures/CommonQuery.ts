import { AbstractFilter } from '../Requests/Filters/AbstractFilter'

export class CommonQuery {
    page: number;
    limit: number;
    filter: AbstractFilter
}
