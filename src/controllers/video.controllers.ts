import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as error from "~/errors/errors";
import { CustomRequest } from "~/middlewares/auth.middleware";
import * as service from "~/services/video.services";

export async function addVideoToUser(req: CustomRequest, res: Response) {
   /* Make sure that the user is only able to upload videos to their own account. */
   if (req.params.id !== req.user?.id.toString())
      return error.badCredentials(res);

   /* Make sure that the user is only able to upload videos */
   const file: UploadedFile | undefined = req.files?.source as UploadedFile;
   if (!file?.mimetype?.includes("video"))
      return error.badRequest(res, ["Invalid file type"]);

   const userFolder = `public/videos/${req.user.id}`;
   const videoPath = service.generateVideoPath(userFolder, req);

   /* Create a folder for the user to store their videos in. */
   service.createUserVideoFolder(userFolder, res);

   /* Move uploaded file to correct folder */
   await file.mv(videoPath, async (err) => {
      if (err) return error.badRequest(res, [err]);
   });

   return res.status(201).json({
      message: "Ok",
      data: (
         await service.createVideo({
            source: videoPath,
            user: req.user.id,
         })
      ).getPublicFields(),
   });
}

export async function getVideos(req: Request, res: Response) {
   const { name, user, duration, page, perPage } = req.body;

   if (page === 0)
      return error.badRequest(res, ["Page number must be greater than 0"]);

   const { rows, count } = await service.getVideos({
      name,
      user,
      duration,
      page,
      perPage,
   });

   const total = Math.ceil(count / perPage);

   if (page > total && page > 1)
      return error.badRequest(res, ["Page not found"]);

   return res.status(200).json({
      message: "Ok",
      data: rows.map((video) => video.getPublicFields()),
      pager: { current: page, total: total },
   });
}
