import { User } from "~/models";
import { Op } from "sequelize";
import { SHA256 } from "crypto-js";
import encBase64 from "crypto-js/enc-base64";

/**
 * It creates a new user in the database
 * @param fields - { [key: string]: string }
 * @returns A promise of a user
 */
export async function createNewUser(fields: {
   username: string;
   email: string;
   pseudo: string;
   password: string;
}): Promise<User> {
   const { username, pseudo, email, password } = fields;
   return await User.create({
      username,
      pseudo,
      email,
      password: hashPassword(password),
   });
}

/**
 * It returns all users that match the given fields
 * @param fields - { [key: string]: string }
 * @returns An array of users
 */
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

export function hashPassword(password: string): string {
   return SHA256(password).toString(encBase64);
}
