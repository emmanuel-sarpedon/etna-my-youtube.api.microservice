import * as validator from "~/validators/user.validators";
import * as controller from "~/controllers/user.controllers";
import { Endpoint } from "~/@types/route.type";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/users",
      validatorSchema: validator.userCreationSchema,
      authentication: "notRequired",
      handler: controller.registerNewUser,
      description: "Register a new user",
   },
   {
      method: "post",
      path: "/auth",
      validatorSchema: validator.userLoginSchema,
      authentication: "notRequired",
      handler: controller.loginUser,
      description: "Login a user",
   },
   {
      method: "delete",
      path: "/user/:id",
      validatorSchema: validator.userDeletionSchema,
      authentication: "required",
      handler: controller.deleteUser,
      description: "Delete a user",
   },
   {
      method: "put",
      path: "/user/:id",
      validatorSchema: validator.userUpdateSchema,
      authentication: "required",
      handler: controller.updateUser,
      description: "Update a user",
   },
   {
      method: "get",
      path: "/users",
      validatorSchema: validator.usersListSchema,
      authentication: "notRequired",
      handler: controller.getUsersByPseudo,
      description: "Get users by pseudo",
   },
   {
      method: "get",
      path: "/user/:id",
      validatorSchema: validator.userListSchema,
      authentication: "optional",
      handler: controller.getUserById,
      description: "Get user by id",
   },
];
