import { Request, Response } from "express";
import * as service from "~/services/user.services";

export async function registerNewUser(
   req: Request,
   res: Response,
) {
   if (await service.isUserExist(req.body)) {
      res.status(400).json({
         message: "Bad Request",
         code: 400,
         data: ["User already exist"],
      });
   } else res.json(req.body);
}
