import { ValidationChain } from 'express-validator'
import { RequestHandler } from 'express'

export type Endpoint = {
    method: "get" | "post" | "put" | "delete";
    path: string;
    validatorSchema?: ValidationChain[];
    handler: RequestHandler;
};
