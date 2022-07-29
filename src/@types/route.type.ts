import { ValidationChain } from "express-validator";
import { RequestHandler } from "express";

export type Endpoint = {
   method: "get" | "post" | "put" | "delete";
   path: string;
   handler: RequestHandler;
   validatorSchema?: ValidationChain[];
   authentication: "required" | "optional" | "notRequired";
   description?: string;
};
