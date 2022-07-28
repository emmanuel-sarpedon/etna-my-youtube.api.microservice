import { sequelize } from "~/models";
import log4js from "log4js";

const logger = log4js.getLogger("DATABASE");
logger.level = "trace";

export default async () => {
   try {
      await sequelize.sync({ alter: true });
      logger.trace("💽Connection has been established successfully.");
   } catch (error) {
      logger.error("🚫Unable to connect to the database:", error);
   }
};
