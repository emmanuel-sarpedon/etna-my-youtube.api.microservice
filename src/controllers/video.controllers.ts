import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as error from "~/errors/errors";
import { CustomRequest } from "~/middlewares/auth.middleware";
import * as service from "~/services/video.services";
import { Video } from "~/models/video.model";

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
   service.createVideoFolder(userFolder, res);

   /* Move uploaded file to correct folder. */
   await file.mv(videoPath, async (err) => {
      if (err) return error.badRequest(res, [err]);
   });

   /* Getting the metadata of the video. */
   const metadata = await service.getVideoMetadata(videoPath);

   const videoInstance = await (async (userId: number) => {
      if (metadata.format?.duration)
         return await service.createVideo({
            source: videoPath,
            user: userId,
            duration: metadata.format.duration,
         });

      return await service.createVideo({
         source: videoPath,
         user: userId,
      });
   })(req.user?.id);

   return res.status(201).json({
      message: "Ok",
      data: videoInstance.getPublicFields(),
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

export async function getVideosByUserId(req: Request, res: Response) {
   const { page, perPage } = req.body;

   if (page === 0)
      return error.badRequest(res, ["Page number must be greater than 0"]);

   const { rows, count } = await service.getVideosByUserId(
      req.params.id,
      parseInt(page),
      parseInt(perPage)
   );

   const total = Math.ceil(count / perPage);

   if (page > total && page > 1)
      return error.badRequest(res, ["Page not found"]);

   return res.status(200).json({
      message: "Ok",
      data: rows.map((video) => video.getPublicFields()),
      pager: { current: page, total: total },
   });
}

export async function encodeVideo(req: Request, res: Response) {
   const { id } = req.params;
   const { format } = req.body;

   const video: Video | null = await service.getVideoById(id);
   if (!video) return error.ressourcesNotFound(res);
   const videoName = service.getVideoName(video);
   if (!videoName) return error.badRequest(res, ["Video not found"]);

   const encodedVideoFolderPath = service.generateEncodedVideoFolderPath(
      video,
      format
   );

   await service.createVideoFolder(encodedVideoFolderPath, res);

   const outputEncodedVideoPath = service.generateEncodedVideoPath(
      encodedVideoFolderPath,
      videoName
   );

   service
      .encodeVideo(video.source, outputEncodedVideoPath, format)
      .then(async () => {
         const JSONFormat: Video["format"] = { ...video.format };
         JSONFormat[format as keyof Video["format"]] = outputEncodedVideoPath;

         const updatedVideo = await service.updateVideo(video, {
            format: JSONFormat,
         });

         return res.status(200).json({
            message: "Ok",
            data: updatedVideo.getPublicFields(),
         });
      })
      .catch((err) => {
         return error.badRequest(res, [err.message]);
      });
}

export async function updateVideo(req: CustomRequest, res: Response) {
   const { id } = req.params;
   const { name, user } = req.body;

   if (user !== req.user?.id) return error.badCredentials(res);

   const video: Video | null = await service.getVideoById(id);
   if (!video) return error.ressourcesNotFound(res);

   const updatedVideo = await service.updateVideoName(
      video,
      name.replaceAll(" ", "_")
   );

   return res.status(200).json({
      message: "Ok",
      data: updatedVideo.getPublicFields(),
   });
}
