import { Response } from 'express'
import { AbstractRepository } from '../Repositories/AbstractRepository'

export abstract class AbstractController {
    protected repository: AbstractRepository;

    constructor(repository: AbstractRepository) {
        this.repository = repository;
    }

    protected errorResponse(res: Response, code: number, message: string): void {
        res.status(code).send(message);
    }

    protected okResponse(res: Response, data: Record<string, any> | Record<string, any>[]): void {
        res.status(200).send(data);
    }
}
