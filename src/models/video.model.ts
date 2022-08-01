import { DataTypes, Model } from "sequelize";
import { sequelize } from "~/init/database.init";
import { Comment } from '~/models/comment.model'

export class Video extends Model {
   declare id: number;
   declare source: string;
   declare createdAt: Date;
   declare views: number;
   declare duration: number | undefined;
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
         type: DataTypes.JSON,
         defaultValue: {
            "1080": null,
            "720": null,
            "480": null,
            "360": null,
            "240": null,
            "144": null,
         },
      },
   },
   { sequelize }
);

Video.hasMany(Comment, { foreignKey: "video" });
