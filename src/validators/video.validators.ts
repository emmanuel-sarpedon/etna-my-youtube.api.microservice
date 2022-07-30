import { body, param } from "express-validator";

export const videoUploadSchema = [param("id").isInt()];
