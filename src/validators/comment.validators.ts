import { body, param } from "express-validator";

export const commentCreationSchema = [
   param("id").isInt(),

   body("body").isString().notEmpty(),
];
