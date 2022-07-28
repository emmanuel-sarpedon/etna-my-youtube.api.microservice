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

export async function getUsers(fields: {
   [key: string]: string;
}): Promise<User[]> {
   const { username, pseudo, email } = fields;

   return await User.findAll({
      where: {
         [Op.or]: Object.entries({ username, pseudo, email }).map(
            ([key, value]) => {
               return { [key]: value };
            }
         ),
      },
   });
}

/**
 * It returns a promise that resolves to true if there's at least one user in the database that matches the given fields
 * @param fields - { [key: string]: string }
 * @returns A promise that resolves to a boolean.
 */
export function isUserExist(fields: {
   [key: string]: string;
}): Promise<boolean> {
   return getUsers(fields).then((users: User[]) => users.length > 0);
}
