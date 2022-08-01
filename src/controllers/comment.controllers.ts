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

export async function getComments(req: CustomRequest, res: Response) {
   const { page, perPage } = req.body;

   if (!req.user?.id) return error.badCredentials(res);

   const { rows, count } = await service.getComments({
      videoId: parseInt(req.params.id),
      page: parseInt(page),
      perPage: parseInt(perPage) || 5,
   });

   const total = Math.ceil(count / (perPage || 5));

   if (page > total && page > 1)
      return error.badRequest(res, ["Page not found"]);

   return res.status(200).json({
      message: "Ok",
      data: rows.map((comment) => comment.getPublicFields()),
      pager: { current: page, total: total },
   });
}
