import { Response, Router, Request } from 'express'
import { CrudServiceInterface } from '../Services/CrudServiceInterface'
import asyncHandler from 'express-async-handler'
import { ValidationError, validateOrReject } from 'class-validator'
import { AbstractRequest } from '../Requests/AbstractRequest'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
import { AbstractFilter } from '../Requests/Filters/AbstractFilter'
import { FilterRequest } from '../Requests/FilterRequest'
import { TypeCaster } from '../Services/TypeCaster'
import { AbstractTransformer } from '../ResponseTransformers/AbstractTransformer'
import { AbstractModel } from '../Models/AbstractModel'
import { ValidationErrorParser } from '../Services/ValidationErrorParser'
import { GeneralException } from '../Exceptions/GeneralException'

export abstract class AbstractController {
    public router: Router;
    protected service: CrudServiceInterface;

    constructor(service: CrudServiceInterface, router: Router) {
        this.router = router;
        this.service = service;
    }

    protected getAllModels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const filterRequest = new FilterRequest(TypeCaster.toStringOfUndefined(req.query.filter));

        try {
            await validateOrReject(filterRequest);
        } catch (errors) {
            this.errorResponse(res, 400, errors);
            return;
        }

        const filter = this.getFilterData();
        filter.populateData(filterRequest.filter);
        const indexRequest = new CommonIndexRequest(Number(req.query.page), Number(req.query.limit), filter);

        try {
            await validateOrReject(indexRequest);
        } catch (errors) {
            this.errorResponse(res, 400, errors);
            return;
        }

        const queryData = new CommonIndexRequest(indexRequest.page, indexRequest.limit, indexRequest.filter);
        queryData.page = indexRequest.page;
        queryData.limit = indexRequest.limit;
        queryData.filter = indexRequest.filter;

        const models = await this.service.index(queryData);
        await this.okResponse(res, models);
    });

    protected getModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);
        let model;

        try {
            model = await this.service.show(modelId);
        } catch (error) {
            this.errorResponse(res, 404, error);
            return;
        }

        await this.okResponse(res, model);
    });

    protected createModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        let model;
        const request = this.getCreateRequest();
        request.populateData(req.body);

        try {
            await validateOrReject(request);
        } catch (errors) {
            this.errorResponse(res, 400, errors);
            return;
        }

        try {
            model = await this.service.store(request);
        } catch (error) {
            this.errorResponse(res, 422, error);
            return;
        }

        await this.okResponse(res, model);
    });

    protected updateModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);
        let model;
        const request = this.getUpdateRequest();
        request.populateData(req.body);

        try {
            await validateOrReject(request);
        } catch (errors) {
            this.errorResponse(res, 400, errors);
            return;
        }

        try {
            model = await this.service.update(modelId, request);
        } catch (error) {
            this.errorResponse(res, 422, error);
            return;
        }

        await this.okResponse(res, model);
    });

    protected deleteModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const modelId = parseInt(req.params.id);

        try {
            await this.service.delete(modelId);
        } catch (error) {
            this.errorResponse(res, 400, error);
            return;
        }

        await this.okResponse(res);
    });

    protected errorResponse(res: Response, code: number, exceptions: ValidationError[] | GeneralException | string): void {
        if (typeof exceptions === 'string') {
            res.status(code).send(exceptions);
            return;
        }

        if (Array.isArray(exceptions)) {
            res.status(code).send(ValidationErrorParser.parseValidationErrors(exceptions));

            return;
        }

        res.status(code).send(exceptions.message);
    }

    protected async okResponse(res: Response, data: AbstractModel | AbstractModel[] | string | null = null): Promise<void> {
        if (!data) {
            res.status(200).send({ success: true });
            return;
        }

        if (typeof data === 'string') {
            res.status(200).send({ token: data });
            return;
        }


        const transformer = this.getTransformer();
        const transformedData = await transformer.transform(data);
        res.status(200).send(transformedData);
    }

    public abstract intializeRoutes(): void;
    protected abstract getFilterData(): AbstractFilter;
    protected abstract getTransformer(): AbstractTransformer;
    protected abstract getCreateRequest(): AbstractRequest;
    protected abstract getUpdateRequest(): AbstractRequest;
}
