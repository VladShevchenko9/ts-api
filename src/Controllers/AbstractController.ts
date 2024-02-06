import { Response, Router, Request } from 'express'
import { CrudServiceInterface } from '../Services/CrudServiceInterface'
import asyncHandler from 'express-async-handler'
import { validateOrReject } from 'class-validator'
import { AbstractRequest } from '../Requests/AbstractRequest'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
import { AbstractFilter } from '../Requests/Filters/AbstractFilter'
import { CommonQuery } from '../Structures/CommonQuery'

export abstract class AbstractController {
    public router: Router;
    protected service: CrudServiceInterface;
    protected request: AbstractRequest;

    constructor(service: CrudServiceInterface, router: Router, request: AbstractRequest) {
        this.router = router;
        this.service = service;
        this.request = request;
    }

    protected getAllModels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const filter = this.getFilterData();
        filter.populateData(JSON.parse(String(req.query.filter)))
        const indexRequest = new CommonIndexRequest(Number(req.query.page), Number(req.query.limit), filter);

        try {
            await validateOrReject(indexRequest);
        } catch (errors) {
            this.errorResponse(res, 400, 'Invalid query params');
            return;
        }

        const queryData = new CommonQuery();
        queryData.page = indexRequest.page;
        queryData.limit = indexRequest.limit;
        queryData.filter = indexRequest.filter;

        const models = (await this.service.index(queryData)).map(model => model.toJson());
        this.okResponse(res, models);
    });

    protected getModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);
        let model;

        try {
            model = await this.service.show(modelId);
        } catch (e) {
            this.errorResponse(res, 404, e.message);
            return;
        }

        this.okResponse(res, model.toJson());
    });

    protected createModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        let model;
        this.request.refresh();
        this.request.populateData(req.body);

        try {
            await validateOrReject(this.request);
        } catch (errors) {
            this.errorResponse(res, 400, 'Invalid data');
            return;
        }

        try {
            model = await this.service.store(this.request);
        } catch (e) {
            this.errorResponse(res, 422, e.message);
            return;
        }

        this.okResponse(res, model.toJson());
    });

    protected updateModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);
        let model;
        this.request.refresh();
        this.request.populateData(req.body);

        try {
            await validateOrReject(this.request);
        } catch (errors) {
            this.errorResponse(res, 400, 'Invalid data');
            return;
        }

        try {
            model = await this.service.update(modelId, this.request);
        } catch (e) {
            this.errorResponse(res, 422, e.message);
            return;
        }

        this.okResponse(res, model.toJson());
    });

    protected deleteModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);

        try {
            await this.service.delete(modelId);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, { success: true });
    });

    protected errorResponse(res: Response, code: number, message: string): void {
        res.status(code).send(message);
    }

    protected okResponse(res: Response, data: Record<string, any> | Record<string, any>[] | string): void {
        res.status(200).send(data);
    }

    public abstract intializeRoutes(): void;
    protected abstract getFilterData(): AbstractFilter;
}
