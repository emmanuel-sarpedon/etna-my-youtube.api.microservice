import cors from "cors";
import express from "express";
import * as fs from "fs";
require("dotenv").config();
const formidableMiddleware = require("express-formidable");

const app = express();
app.use(express.json());
app.use(cors());
app.use(formidableMiddleware());

const routes: string[] = fs.readdirSync("./src/routes");

/* Looping through the routes folder and importing all the routes. */
for (const route of routes) {
   if (route.includes(".routes.ts")) {
      try {
         const routeModule = require(`./routes/${route}`);
         app.use(routeModule.router);

         console.log("Import path : " + route);
      } catch (e) {
         console.error(e);
      }
   }
}

app.listen(process.env.PORT || 3000, () =>
   console.log("Server started on port " + (process.env.PORT || "3000"))
);
