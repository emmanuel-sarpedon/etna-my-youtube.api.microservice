import fs from "fs";
import { validatorMiddleware } from "~/middlewares/validator.middleware";
import { app } from "~/app";
import logger from "~/init/logger.init";
import { Endpoint } from "~/@types/route.type";
import { Router } from "express";

export default () => {
   const routes: string[] = fs.readdirSync("./src/routes");
   const router = Router();

   for (const route of routes) {
      if (route.includes(".routes.ts")) {
         try {
            /* Importing the endpoints from the route folder. */
            const endpoints: Endpoint[] =
               require(`../routes/${route}`).endpoints;

            endpoints.forEach((endpoint: Endpoint) => {
               const { method, path, validatorSchema, handler } = endpoint;

               /* A dynamic way to add routes to the router. */
               router[method](
                  path,
                  validatorSchema ? validatorSchema : [],
                  validatorSchema ? validatorMiddleware : [],
                  handler
               );
            });
            logger.trace("🏁Adding route " + route);
         } catch (e) {
            logger.error(e);
         }
      }
   }

   app.use(router);
};
