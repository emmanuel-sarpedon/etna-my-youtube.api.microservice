import { Video } from "~/models/video.model";

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
