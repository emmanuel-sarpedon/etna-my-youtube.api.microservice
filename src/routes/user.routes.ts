import * as validator from "~/validators/user.validators";
import * as controller from "~/controllers/user.controllers";
import { Endpoint } from "~/@types/route.type";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/users",
      validatorSchema: validator.userCreationSchema,
      handler: controller.registerNewUser,
      description: "Register a new user",
   },
   {
      method: "post",
      path: "/auth",
      validatorSchema: validator.userLoginSchema,
      handler: controller.loginUser,
      description: "Login a user",
   },
   {
      method: "delete",
      path: "/user/:id",
      validatorSchema: validator.userDeletionSchema,
      isAuthenticated: true,
      handler: controller.deleteUser,
      description: "Delete a user",
   },
   {
      method: "put",
      path: "/user/:id",
      validatorSchema: validator.userUpdateSchema,
      isAuthenticated: true,
      handler: controller.updateUser,
      description: "Update a user",
   },
];
