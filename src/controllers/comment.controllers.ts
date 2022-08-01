import { CustomRequest } from "~/middlewares/auth.middleware";
import * as error from "~/errors/errors";
import * as service from "~/services/comment.services";
import { Response } from "express";

export async function createComment(req: CustomRequest, res: Response) {
   if (!req.user?.id) return error.badCredentials(res);

   const commentCreated = await service.createComment({
      body: req.body.body,
      user: req.user.id,
      video: parseInt(req.params.id),
   });

   return res
      .status(201)
      .json({ message: "Ok", data: commentCreated.getPublicFields() });
}
