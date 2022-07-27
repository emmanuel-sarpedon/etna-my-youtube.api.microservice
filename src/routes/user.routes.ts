import express, { Request, Response } from "express";
import * as service from "~/services/user.services";

export const router = express.Router();

router.post("/users", async (req: Request, res: Response) => {
   // hide password field from the request body
   const { password, ...fields } = req.body;
   const user = await service.findUser({ ...fields });

   return res.json(user);
});
