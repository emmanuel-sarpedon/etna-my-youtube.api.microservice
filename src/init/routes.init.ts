import fs from "fs";
import { validatorMiddleware } from "~/middlewares/validator.middleware";
import { app } from "~/app";
import { Endpoint } from "~/@types/route.type";
import { Router } from "express";

import log4js from "log4js";
import { requiredAuth, optionalAuth } from "~/middlewares/auth.middleware";

const logger = log4js.getLogger("ROUTES");
logger.level = "trace";

/**
 * It takes an array of endpoints and a router, and adds the endpoints to the router
 * @param {Endpoint[]} endpoints - Endpoint[] - An array of endpoints.
 * @param {Router} router - The router object that we created in the previous step.
 */
const addEndpointsToRouter = (endpoints: Endpoint[], router: Router): void => {
   endpoints.forEach((endpoint: Endpoint, index: number) => {
      const {
         method,
         path,
         validatorSchema,
         authentication,
         handler,
         description,
      } = endpoint;

      /* A dynamic way to add routes to the router. */
      router[method](
         path,
         validatorSchema ? validatorSchema : [],
         validatorSchema ? validatorMiddleware : [],
         authentication === "required" ? requiredAuth : [],
         authentication === "optional" ? optionalAuth : [],
         handler
      );

      /* Logging the routes to the console. */
      logger.trace(
         //prettier-ignore
         `﹒ ${index + 1} - [${method.toUpperCase()}] ${path} - ${description}`
         // ﹒ 1 - [POST] /users - Register a new user
      );
   });
};

export default () => {
   const routes: string[] = fs.readdirSync("./src/routes");
   const router: Router = Router();

   for (const route of routes) {
      if (route.includes(".routes.ts")) {
         try {
            logger.trace("Importing file " + route);

            /* Importing the endpoints from the route folder. */
            const endpoints: Endpoint[] =
               require(`../routes/${route}`).endpoints;

            addEndpointsToRouter(endpoints, router);
         } catch (e) {
            logger.error(e);
         }
      }
   }

   app.use(router);
};
