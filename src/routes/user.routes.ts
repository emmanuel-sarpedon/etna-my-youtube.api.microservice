import * as validator from "~/validators/user.validators";
import * as controller from "~/controllers/user.controllers";
import { Endpoint } from "~/@types/route.type";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/users",
      validatorSchema: validator.userCreationSchema,
      handler: controller.registerNewUser,
   },
   {
      method: "post",
      path: "/auth",
      validatorSchema: validator.userLoginSchema,
      handler: controller.loginUser,
   },
];
