import { Endpoint } from "~/@types/route.type";
import * as validator from "~/validators/comment.validators";
import * as controller from "~/controllers/comment.controllers";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/video/:id/comment",
      validatorSchema: validator.commentCreationSchema,
      authentication: "required",
      handler: controller.createComment,
      description: "Create a comment",
   },
   {
      method: "get",
      path: "/video/:id/comments",
      validatorSchema: validator.commentListingSchema,
      authentication: "required",
      handler: controller.getComments,
      description: "Get comments",
   },
];
