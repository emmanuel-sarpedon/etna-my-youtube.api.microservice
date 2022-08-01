import { DataTypes, Model } from "sequelize";
import { sequelize } from "~/init/database.init";

export class Comment extends Model {
   declare id: number;
   declare body: string;
   declare user: number;

   getPublicFields(): Partial<Comment> {
      return {
         id: this.id,
         body: this.body,
         user: this.user,
      };
   }
}

Comment.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      body: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   { sequelize }
);
