import log4js from "log4js";
import { Sequelize } from "sequelize";
require("dotenv").config();

const logger = log4js.getLogger("DATABASE");
logger.level = "trace";

/* Creating a new instance of Sequelize and connecting to the database. */
export const sequelize = new Sequelize(
   process.env.DATABASE_NAME as string,
   process.env.DATABASE_USERNAME as string,
   process.env.DATABASE_PASSWORD as string,
   {
      host: process.env.DATABASE_HOST as string,
      dialect: "postgres",
      logging: false,
   }
);

export default async () => {
   try {
      await sequelize.sync({ alter: true });
      logger.trace("Database connection has been established successfully.");
   } catch (error) {
      logger.error("Unable to connect to the database:", error);
   }
};
