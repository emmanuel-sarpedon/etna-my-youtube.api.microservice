import { DataTypes, Model } from "sequelize";
import { sequelize } from "~/init/database.init";

export class Video extends Model {}

Video.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      source: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      views: {
         type: DataTypes.INTEGER,
         allowNull: false,
         defaultValue: 0,
      },
      enabled: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: true,
      },
      format: {
         type: DataTypes.JSONB,
      },
   },
   { sequelize }
);
