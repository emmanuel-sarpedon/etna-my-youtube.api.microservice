import { DataTypes, Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
   logging: false,
});

export class User extends Model {
   declare username: string;
   declare email: string;
   declare pseudo: string;
   declare password: string;
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
