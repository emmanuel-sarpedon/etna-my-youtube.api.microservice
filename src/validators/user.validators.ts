import { body, param } from "express-validator";

export const userCreationSchema = [
   body("username").isByteLength({ min: 3, max: 20 }),
   body("pseudo").isByteLength({ min: 3, max: 20 }),
   body("email").isEmail(),
   body("password")
      .isByteLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
];

export const userLoginSchema = [
   body("login").not().isEmpty(),
   body("password").not().isEmpty(),
];

export const userDeletionSchema = [param("id").isInt()];

export const userUpdateSchema = [
   param("id").isInt(),

   body("username").isByteLength({ min: 3, max: 20 }).optional(),
   body("pseudo").isByteLength({ min: 3, max: 20 }).optional(),
   body("email").isEmail().optional(),
   body("password")
      .isByteLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .optional(),
];

export const usersListSchema = [
   body("pseudo").isByteLength({ min: 1, max: 20 }),
   body("page").isInt({ min: 0 }),
   body("perPage").isInt({ min: 1 }),
];

export const userListSchema = [param("id").isInt()];
