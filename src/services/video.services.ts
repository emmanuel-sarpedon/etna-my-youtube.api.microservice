import { Video } from "~/models/video.model";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import * as error from "~/errors/errors";
import { Op } from "sequelize";

export async function createVideo(fields: { source: string; user: number }) {
   return await Video.create({
      source: fields.source,
      user: fields.user,
   });
}

export async function updateVideo(
   video: Video,
   fields: { [key: string]: any }
) {
   const { source } = fields;
   return await video.update({ source });
}

export function generateVideoPath(videoFolder: string, req: Request) {
   const file = req.files?.source as UploadedFile;
   return `${videoFolder}/${Date.now()}_${req.body.name}.${file.name
      .split(".")
      .pop()}`;
}

export function createUserVideoFolder(videoFolder: string, res: Response) {
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
}

export async function getVideos(fields: {
   name: string;
   user: number;
   duration: number;
   page: number;
   perPage: number;
}) {
   const { name, user, duration, page, perPage } = fields;

   let filter: { [key: string]: any } = {};

   if (name)
      filter.source = {
         [Op.iLike]: `%${name}%`,
      };

   if (user) filter.user = user;

   return await Video.findAndCountAll({
      where: {
         [Op.and]: {
            ...filter,
            // duration: duration,
         },
      },
      limit: perPage,
      offset: perPage * (page - 1),
   });
}

export async function getVideosByUserId(
   userId: number,
   page: number,
   perPage: number
) {
   return await Video.findAndCountAll({
      where: {
         user: userId,
      },
      limit: perPage,
      offset: perPage * (page - 1),
   });
}
