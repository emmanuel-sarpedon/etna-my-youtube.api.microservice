import { Response } from "express";

export function badRequest(res: Response, data: Array<string> = []) {
   return res.status(400).json({
      message: "Bad Request",
      code: 400,
      data: [...data],
   });
}

export function badCredentials(res: Response) {
   return res.status(401).json({
      message: "Unauthorized",
   });
}
