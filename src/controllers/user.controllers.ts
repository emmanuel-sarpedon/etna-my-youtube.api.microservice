import { Request, Response } from "express";
import * as service from "~/services/user.services";

export async function registerNewUser(req: Request, res: Response) {
   if (await service.isUserExist(req.body)) {
      return res.status(400).json({
         message: "Bad Request",
         code: 400,
         data: ["User already exist"],
      });
   }

   return res.json(req.body);
}
