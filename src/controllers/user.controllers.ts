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

   const newUser = await service.createNewUser(req.body);

   return res
      .status(201)
      .json({ message: "Ok", data: newUser.getPublicFields() });
}

export async function loginUser(req: Request, res: Response) {
   const user = await service.getUserByLogin(req.body.login);

   if (user) return res.json(user);
}
