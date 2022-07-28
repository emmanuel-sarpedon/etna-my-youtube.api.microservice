import { sequelize } from "~/models";
import logger from "~/init/logger.init";
import { app } from "~/app";

export default async () => {
   try {
      await sequelize.sync({ alter: true });
      logger.trace("💽Connection has been established successfully.");

      app.listen(process.env.PORT || 3000, () =>
         logger.trace("✨Server started on port " + (process.env.PORT || "3000"))
      );
   } catch (error) {
      logger.error("🚫Unable to connect to the database:", error);
   }
};
