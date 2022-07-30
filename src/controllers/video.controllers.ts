import { Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as error from "~/errors/errors";
import { CustomRequest } from "~/middlewares/auth.middleware";
import * as service from "~/services/video.services";
import * as fs from "fs";

export async function addVideoToUser(req: CustomRequest, res: Response) {
   /* Make sure that the user is only able to upload videos to their own account. */
   if (req.params.id !== req.user?.id.toString())
      return error.badCredentials(res);

   /* Make sure that the user is only able to upload videos */
   const file: UploadedFile | undefined = req.files?.source as UploadedFile;
   if (!file?.mimetype?.includes("video"))
      return error.badRequest(res, ["Invalid file type"]);

   const userFolder = `public/videos/${req.user.id}`;
   const videoInstance = await service.createVideo({
      source: "",
      user: req.user.id,
   });
   const videoFolder = `${userFolder}/${videoInstance.id}`;
   const videoPath = `${videoFolder}/${Date.now()}_${file.name}`;

   /* Create a folder for the user to store their videos in. */
   fs.mkdir(
      videoFolder,
      {
         recursive: true,
      },
      (err) => {
         if (err)
            return error.badRequest(res, [err.name + " : " + err.message]);
      }
   );

   /* Move uploaded file to correct folder */
   await file.mv(videoPath, async (err) => {
      if (err) return error.badRequest(res, [err]);
   });

   return res.status(201).json({
      message: "Ok",
      data: (
         await service.updateVideo(videoInstance, {
            source: videoPath,
         })
      ).getPublicFields(),
   });
}
