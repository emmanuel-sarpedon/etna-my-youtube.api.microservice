import log4js from "log4js";
import { Sequelize } from "sequelize";
require("dotenv").config();

const logger = log4js.getLogger("DATABASE");
logger.level = "trace";

/* Creating a new instance of Sequelize and connecting to the database. */
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
   logging: false,
});

export default async () => {
   try {
      await sequelize.sync({ alter: true });
      logger.trace("💽Connection has been established successfully.");
   } catch (error) {
      logger.error("🚫Unable to connect to the database:", error);
   }
};
