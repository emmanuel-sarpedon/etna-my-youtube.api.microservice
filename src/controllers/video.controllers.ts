import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as error from "~/errors/errors";
import { CustomRequest } from "~/middlewares/auth.middleware";
import * as service from "~/services/video.services";
import { Video } from "~/models/video.model";

require("dotenv").config();

export async function addVideoToUser(req: CustomRequest, res: Response) {
   /* Make sure that the user is only able to upload videos to their own account. */
   if (req.params.id !== req.user?.id.toString())
      return error.badCredentials(res);

   /* Make sure that the user is only able to upload videos */
   const file: UploadedFile | undefined = req.files?.source as UploadedFile;
   if (!file?.mimetype?.includes("video"))
      return error.badRequest(res, ["Invalid file type"]);

   const videoInstance = await service.createVideo({
      source: "",
      user: req.user.id,
   });

   const videoFolder = `${process.env.PUBLIC_PATH}/sources/${req.user.id}/${videoInstance.id}`;
   const videoPath = service.generateVideoPath(videoFolder, req);

   /* Create a folder for the user to store their videos in. */
   await service.createVideoFolder(videoFolder);

   /* Move uploaded file to correct folder. */
   await file.mv(videoPath, async (err) => {
      if (err) return error.badRequest(res, [err]);
   });

   videoInstance.source = videoPath;

   /* Getting the metadata of the video. */
   const metadata = await service.getVideoMetadata(videoPath);
   if (metadata) videoInstance.duration = metadata.format?.duration;

   await videoInstance.save();

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
   const { format, file } = req.body;

   const video: Video | null = await service.getVideoById(id);
   if (!video) return error.ressourcesNotFound(res);

   const JSONFormat = { ...video.format };
   JSONFormat[format as keyof Video["format"]] = file;

   video.format = JSONFormat;

   await video.save();

   return res.status(200).json({
      message: "Ok",
      data: video.getPublicFields(),
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

export async function deleteVideo(req: CustomRequest, res: Response) {
   const { id } = req.params;

   const video: Video | null = await service.getVideoById(id);
   if (!video) return error.ressourcesNotFound(res);

   if (video.user !== req.user?.id) return error.badCredentials(res);

   await service.deleteVideo(video);

   return res.status(204).send();
}
