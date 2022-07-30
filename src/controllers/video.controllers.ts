import { Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as error from "~/errors/errors";
import { CustomRequest } from "~/middlewares/auth.middleware";
import * as service from "~/services/user.services";

export async function addVideoToUser(req: CustomRequest, res: Response) {
   const file: UploadedFile | undefined = req.files?.source as UploadedFile;
   const user = await service.getUserById(req.params.id);

   if (!file?.mimetype?.includes("video"))
      return error.badRequest(res, ["Invalid file type"]);

   if (req.params.id !== req.user?.id.toString())
      return error.badCredentials(res);

   return res.send("ok");
}
