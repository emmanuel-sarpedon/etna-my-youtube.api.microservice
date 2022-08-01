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
