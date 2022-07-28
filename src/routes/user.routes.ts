import { UserCreationSchema } from "~/validators/user.validators";
import { registerNewUser } from "~/controllers/user.controllers";
import { Endpoint } from "~/@types/route.type";

export const endpoints: Endpoint[] = [
   {
      method: "post",
      path: "/users",
      validatorSchema: UserCreationSchema,
      handler: registerNewUser,
   },
];
