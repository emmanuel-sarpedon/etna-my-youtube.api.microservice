import { Request, Response } from "express";
import * as service from "~/services/user.services";
import * as error from "~/errors/errors";

export async function registerNewUser(req: Request, res: Response) {
   if (await service.isUserExist(req.body))
      return error.badRequest(res, ["User already exist"]);

   const newUser = await service.createNewUser(req.body);

   return res
      .status(201)
      .json({ message: "Ok", data: newUser.getPublicFields() });
}

export async function loginUser(req: Request, res: Response) {
   const user = await service.getUserByLogin(req.body.login);

   if (user && service.isCorrectPassword(req.body.password, user.password))
      return res.status(200).json({
         message: "Ok",
         token: {
            token: service.getJWT(user),
            user: user.getPublicFields(true),
         },
      });

   return error.badCredentials(res);
}
