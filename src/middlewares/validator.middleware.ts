import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import log4js from "log4js";

const logger = log4js.getLogger("validator");
logger.level = "trace";


export function validatorMiddleware(
   req: Request,
   res: Response,
   next: NextFunction
) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const message = {
         message: "Bad Request",
         code: 400,
         data: errors.array(),
      };
      logger.error({ route: `[${req.method}] ${req.url}`, ...message });

      return res.status(400).json(message);
   }

   next();
}
