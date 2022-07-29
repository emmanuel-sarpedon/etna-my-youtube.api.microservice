import log4js from "log4js";
import { NextFunction, Request, Response } from "express";

const logger = log4js.getLogger("HTTP");
logger.level = "trace";

export function traceMiddleware(
   req: Request,
   res: Response,
   next: NextFunction
) {
   res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300)
         logger.info(`[${req.method}] ${req.originalUrl} ${res.statusCode} ✅`);

      if (res.statusCode >= 400 && res.statusCode < 500) {
         logger.error(`[${req.method}] ${req.originalUrl} ${res.statusCode} 🚫`);
      }
   });
   next();
}
