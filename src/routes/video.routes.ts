import * as validator from "~/validators/video.validators";
import * as controller from "~/controllers/video.controllers";
import { Endpoint } from "~/@types/route.type";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/user/:id/video",
      validatorSchema: validator.videoUploadSchema,
      authentication: "required",
      handler: controller.addVideoToUser,
      description: "Upload a video",
   },
   {
      method: "get",
      path: "/videos",
      validatorSchema: validator.videoListSchema,
      authentication: "notRequired",
      handler: controller.getVideos,
      description: "Get videos",
   },
   {
      method: "get",
      path: "/user/:id/videos",
      validatorSchema: validator.videoListByUserIdSchema,
      authentication: "notRequired",
      handler: controller.getVideosByUserId,
      description: "Get videos by user id",
   },
   {
      method: "patch",
      path: "/video/:id",
      validatorSchema: validator.videoEncodeSchema,
      authentication: "notRequired",
      handler: controller.encodeVideo,
      description: "Encode video",
   },
   {
      method: "put",
      path: "/video/:id",
      validatorSchema: validator.videoUpdateSchema,
      authentication: "required",
      handler: controller.updateVideo,
      description: "Update video",
   },
   {
      method: "delete",
      path: "/video/:id",
      validatorSchema: validator.videoDeleteSchema,
      authentication: "required",
      handler: controller.deleteVideo,
      description: "Delete video",
   },
];
