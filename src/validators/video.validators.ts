import { body, param } from "express-validator";

export const videoUploadSchema = [param("id").isInt(), body("name").notEmpty()];

export const videoListSchema = [
   body("name").isByteLength({ min: 1 }).optional(),
   body("user").isNumeric().optional(),
   body("duration").isNumeric().optional(),
   body("page").isInt({ min: 0 }),
   body("perPage").isInt({ min: 1 }),
];

export const videoListByUserIdSchema = [
   param("id").isInt(),

   body("page").isInt({ min: 0 }),
   body("perPage").isInt({ min: 1 }),
];

export const videoEncodeSchema = [
   param("id").isInt(),

   body("format").isIn([1080, 720, 480, 360, 240, 144]),
   body("file").isString().notEmpty(),
];

export const videoUpdateSchema = [
   param("id").isInt(),

   body("name").isString().notEmpty(),
   body("user").isInt(),
];

export const videoDeleteSchema = [param("id").isInt()];
