import fs from "fs";
import { validatorMiddleware } from "~/middlewares/validator.middleware";
import { app } from "~/app";
import { Endpoint } from "~/@types/route.type";
import { Router } from "express";

import log4js from "log4js";
import { authMiddleware } from "~/middlewares/auth.middleware";

const logger = log4js.getLogger("ROUTES");
logger.level = "trace";

export default () => {
   const routes: string[] = fs.readdirSync("./src/routes");
   const router = Router();

   for (const route of routes) {
      if (route.includes(".routes.ts")) {
         try {
            logger.trace("Importing file " + route);

            /* Importing the endpoints from the route folder. */
            const endpoints: Endpoint[] =
               require(`../routes/${route}`).endpoints;

            endpoints.forEach((endpoint: Endpoint, index: number) => {
               const {
                  method,
                  path,
                  validatorSchema,
                  isAuthenticated,
                  handler,
               } = endpoint;

               /* A dynamic way to add routes to the router. */
               router[method](
                  path,
                  validatorSchema ? validatorSchema : [],
                  validatorSchema ? validatorMiddleware : [],
                  isAuthenticated ? authMiddleware : [],
                  handler
               );

               logger.trace(
                  `﹒ ${index + 1} - [${method.toUpperCase()}] ${path}`
               );
            });
         } catch (e) {
            logger.error(e);
         }
      }
   }

   app.use(router);
};
