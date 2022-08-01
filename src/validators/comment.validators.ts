import { body, param } from "express-validator";

export const commentCreationSchema = [
   param("id").isInt(),

   body("body").isString().notEmpty(),
];

export const commentListingSchema = [
   param("id").isInt(),

   body("page").isInt({ min: 0 }),
   body("perPage").isInt({ min: 1 }).optional(),
];
