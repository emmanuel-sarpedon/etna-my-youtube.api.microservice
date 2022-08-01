import { DataTypes, Model } from "sequelize";
import { sequelize } from "~/init/database.init";
import { Video } from "~/models/video.model";
import { Comment } from "~/models/comment.model";

export class User extends Model {
   declare id: number;
   declare username: string;
   declare pseudo: string;
   declare createdAt: Date;
   declare email: string;
   declare password: string;

   getPublicFields(isAuthenticated: boolean = false) {
      const publicFields: Partial<User> = {
         id: this.id,
         username: this.username,
         pseudo: this.pseudo,
         createdAt: this.createdAt,
         email: this.email,
      };

      if (!isAuthenticated) delete publicFields.email;

      return publicFields;
   }
}

User.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      username: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         validate: { isEmail: true, notEmpty: true },
      },
      pseudo: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   { sequelize }
);

User.hasMany(Video, { foreignKey: "user" });
User.hasMany(Comment, { foreignKey: "user" });
