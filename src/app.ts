import cors from "cors";
import express from "express";
import * as fs from "fs";
require("dotenv").config();
import { sequelize } from "~/models";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const routes: string[] = fs.readdirSync("./src/routes");

console.log(routes);

/* Looping through the routes folder and importing all the routes. */
for (const route of routes) {
   if (route.includes(".routes.ts")) {
      try {
         const routeModule = require(`./routes/${route}`);
         app.use(routeModule.router);
         console.log("Import route : " + route);
      } catch (e) {
         console.error(e);
      }
   }
}

(async () => {
   try {
      sequelize.sync({ alter: true }).then(() => {
         console.log("Connection has been established successfully.");
      });
      app.listen(process.env.PORT || 3000, () =>
         console.log("Server started on port " + (process.env.PORT || "3000"))
      );
   } catch (error) {
      console.error("Unable to connect to the database:", error);
   }
})();
