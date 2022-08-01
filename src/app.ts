import cors from "cors";
import express, { Request, Response } from "express";
import databaseInit from "~/init/database.init";
import routesInit from "~/init/routes.init";
import { traceMiddleware } from "~/middlewares/trace.middleware";
import log4js from "log4js";
import fileUpload from "express-fileupload";

const logger = log4js.getLogger("app.service");
logger.level = "trace";

export const app = express();

/* 1 - Basic setup for express server. */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(traceMiddleware);

/* 2 - Importing all the routes from the route's folder. */
routesInit();

/* 3 - Trying to connect to the database. */
(async () => await databaseInit())();

/* 4 - A middleware that will be called if no other route is found. */
app.all("*", (req: Request, res: Response) => {
   return res.status(400).json({
      message: "Bad Request",
      code: 400,
      data: ["Page not found"],
   });
});

/* 5 - Start the server. */
app.listen(process.env.PORT || 3000, () =>
   logger.trace("✨Server started on port " + (process.env.PORT || "3000"))
);
