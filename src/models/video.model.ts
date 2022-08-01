import { DataTypes, Model } from "sequelize";
import { sequelize } from "~/init/database.init";

export class Video extends Model {
   declare id: number;
   declare source: string;
   declare createdAt: Date;
   declare views: number;
   declare enabled: boolean;
   declare user: number;
   declare format: {
      1080: string;
      720: string;
      480: string;
      360: string;
      240: string;
      144: string;
   };

   getPublicFields(): Partial<Video> {
      return {
         id: this.id,
         source: this.source,
         createdAt: this.createdAt,
         views: this.views,
         enabled: this.enabled,
         user: this.user,
         format: this.format,
      };
   }
}

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
      duration: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      format: {
         type: DataTypes.JSONB,
         defaultValue: {
            "1080": "",
            "720": "",
            "480": "",
            "360": "",
            "240": "",
            "144": "",
         },
      },
   },
   { sequelize }
);
