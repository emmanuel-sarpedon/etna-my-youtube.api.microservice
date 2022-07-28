import cors from "cors";
import express from "express";
import databaseInit from "~/init/database.init";
import routesInit from "~/init/routes.init";
import { traceMiddleware } from "~/middlewares/trace.middleware";
import logger from "~/init/logger.init";

export const app = express();

try {
   /* 1 - Basic setup for express server. */
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(cors());
   app.use(traceMiddleware);

   /* 2 - Importing all the routes from the route's folder. */
   routesInit();

   /* 3 - Trying to connect to the database and if it fails it will throw an error. */
   databaseInit();
} catch (e) {
   logger.fatal(e);
}
