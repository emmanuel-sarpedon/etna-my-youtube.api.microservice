import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import * as error from "~/errors/errors";
import { User } from "~/models";

export interface CustomRequest extends Request {
   user?: User;
   isAuthenticated?: boolean;
}

export function requiredAuth(
   req: CustomRequest,
   res: Response,
   next: NextFunction
) {
   const token = req.header("Authorization")?.replace("Bearer ", "");

   if (!token) return error.badCredentials(res);

   try {
      req.user = jwt.verify(
         token,
         process.env.JWT_SECRET_KEY as Secret
      ) as User;
      req.isAuthenticated = true;

      next();
   } catch (e) {
      return error.badCredentials(res);
   }
}

export function optionalAuth(
   req: CustomRequest,
   res: Response,
   next: NextFunction
) {
   const token = req.header("Authorization")?.replace("Bearer ", "");

   if (!token) {
      req.isAuthenticated = false;
      next();
   } else {
      try {
         req.user = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as Secret
         ) as User;
         req.isAuthenticated = true;

         next();
      } catch (e) {
         return error.badCredentials(res);
      }
   }
}
