import { User } from "~/models";
import { Op } from "sequelize";
import { SHA256 } from "crypto-js";
import encBase64 from "crypto-js/enc-base64";
import jwt, { Secret } from "jsonwebtoken";

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

export async function getUserById(id: string): Promise<User | null> {
   return await User.findByPk(id);
}

/**
 * It returns a user from the database, based on the login parameter
 * @param {string} login - string
 * @returns A promise that resolves to a user object
 */
export async function getUserByLogin(login: string): Promise<User | null> {
   return await User.findOne({
      where: {
         [Op.or]: [{ username: login }, { pseudo: login }, { email: login }],
      },
   });
}

export async function getUsersByPseudo(
   pseudo: string,
   page: number,
   perPage: number
): Promise<{ rows: User[]; count: number }> {
   return await User.findAndCountAll({
      where: {
         pseudo: {
            [Op.iLike]: `%${pseudo}%`,
         },
      },
      limit: perPage,
      offset: perPage * (page - 1),
   });
}

export async function updateUser(
   user: User,
   fields: { [key: string]: string }
): Promise<User> {
   const { username, pseudo, email, password } = fields;

   const fieldsToUpdate: { [key: string]: string } = {};

   if (username) fieldsToUpdate.username = username;
   if (pseudo) fieldsToUpdate.pseudo = pseudo;
   if (email) fieldsToUpdate.email = email;
   if (password) fieldsToUpdate.password = hashPassword(password);

   return await user.update({ ...fieldsToUpdate });
}

export async function deleteUser(user: User): Promise<void> {
   await user.destroy();
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

/**
 * It takes a string, hashes it, and returns the hash as a string
 * @param {string} password - The password to hash.
 * @returns A hash of the password
 */
export function hashPassword(password: string): string {
   return SHA256(password).toString(encBase64);
}

/**
 * If the hash is undefined, return false, otherwise return true if the hash is equal to the hashed password.
 * @param {string} password - The password to hash.
 * @param {string | undefined} hash - The hash that was generated from the password.
 * @returns A boolean value.
 */
export function isCorrectPassword(
   password: string,
   hash: string | undefined
): boolean {
   return hash === hashPassword(password);
}

/**
 * It takes a user object and returns a JWT
 * @param {User} user - User - The user object that we want to generate a JWT for.
 * @returns A JWT token
 */
export function getJWT(user: User): string {
   return jwt.sign(
      user.getPublicFields(true),
      process.env.JWT_SECRET_KEY as Secret,
      {
         expiresIn: "7d",
      }
   );
}
