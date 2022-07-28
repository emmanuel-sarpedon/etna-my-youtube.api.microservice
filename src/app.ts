import cors from "cors";
import express, { RequestHandler, Router } from "express";
import * as fs from "fs";
require("dotenv").config();
import { sequelize } from "~/models";
import { ValidationChain } from "express-validator";
import { validatorMiddleware } from "~/validators/validatorMiddleware";
import log4js from "log4js";

const logger = log4js.getLogger();
logger.level = "trace";

/* 1 - Basic setup for express server. */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* 2 - Importing all the routes from the route's folder. */
const routes: string[] = fs.readdirSync("./src/routes");
const router = Router();
export type Endpoint = {
   method: "get" | "post" | "put" | "delete";
   path: string;
   validatorSchema?: ValidationChain[];
   handler: RequestHandler;
};
for (const route of routes) {
   if (route.includes(".routes.ts")) {
      try {
         const endpoints: Endpoint[] = require(`./routes/${route}`).endpoints;
         endpoints.forEach((endpoint: Endpoint) => {
            const { method, path, validatorSchema, handler } = endpoint;

            if (validatorSchema)
               router[method](
                  path,
                  validatorSchema,
                  validatorMiddleware,
                  handler
               );
            else router[method](path, handler);
         });

         logger.info("Import route : " + route);
      } catch (e) {
         logger.error(e);
      }
   }
}
app.use(router);

/* 3 - Trying to connect to the database and if it fails it will throw an error. */
(async () => {
   try {
      sequelize.sync({ alter: true }).then(() => {
         logger.trace("Connection has been established successfully.");
      });
      app.listen(process.env.PORT || 3000, () =>
         logger.trace("Server started on port " + (process.env.PORT || "3000"))
      );
   } catch (error) {
      logger.error("Unable to connect to the database:", error);
   }
})();
