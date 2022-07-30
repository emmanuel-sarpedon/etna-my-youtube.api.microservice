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
    }
]
