import { Comment } from "~/models/comment.model";

export async function createComment(fields: {
   body: string;
   user: number;
   video: number;
}) {
   return await Comment.create({
      ...fields,
   });
}

export async function getComments(fields: {
   videoId: number;
   page: number;
   perPage: number;
}) {
   const { videoId, page, perPage } = fields;

   return await Comment.findAndCountAll({
      where: {
         video: videoId,
      },
      limit: perPage,
      offset: perPage * (page - 1),
   });
}
