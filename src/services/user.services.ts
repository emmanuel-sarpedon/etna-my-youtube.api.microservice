import { User } from "~/models";
import { Op } from "sequelize";

export async function createNewUser(newUser: {
   username: string;
   email: string;
   pseudo: string;
   password: string;
}): Promise<User> {
   return await User.create(newUser);
}

export async function findUser(fields: {
   username: string;
   email: string;
   pseudo: string;
}) {
   return await User.findAll({
      where: {
         [Op.or]: [{ ...fields }],
      },
   });
}
