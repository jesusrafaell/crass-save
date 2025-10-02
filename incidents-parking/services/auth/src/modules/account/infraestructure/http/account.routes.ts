import { FastifyInstance } from "fastify";
import { registerSchema } from "../../../../common/validator/auth/registerValidator";
import {
  loginGuestSchema,
  loginSchema,
  loginTruckSchema,
} from "../../../../common/validator/auth/loginValidator";
import { changePasswordValidation } from "../../../../common/validator/auth/changePasswordValidator";
import {
  changePasswordByEmailValidator,
  forgetPasswordValidator,
} from "../../../../common/validator/auth/forgetPasswordValidator";
import AccountController from "../../application/controller/account.controller";
import AuthController from "../../application/controller/auth.controller";
import { updateTransportTypeValidator } from "../../../../common/validator/user/updateValidator";

export class AccountRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const authController = new AuthController();
    const accountController = new AccountController();

    /* logins */
    fastify.post("/login", { schema: loginSchema }, authController.loginMobile);
    fastify.post(
      "/login/guest",
      { schema: loginGuestSchema },
      authController.loginGuest
    );
    fastify.post(
      "/login/manager",
      { schema: loginSchema },
      authController.loginManger
    );
    fastify.post(
      "/login/truck",
      { schema: loginTruckSchema },
      authController.loginTruck
    );
    fastify.post(
      "/login/parkinglot",
      { schema: loginSchema },
      authController.loginParking
    );

    fastify.post("/logout", authController.logout);

    //registger account (create user, create localization, create verify)
    fastify.post(
      "/register",
      { schema: registerSchema },
      accountController.createAccount
    );

    fastify.post(
      "/changePassword",
      { schema: changePasswordValidation },
      accountController.changePassword
    );
    fastify.post(
      "/forgot-password",
      { schema: forgetPasswordValidator },
      accountController.forgotPasswordByEmail
    );

    fastify.put(
      "/forgot-password",
      { schema: changePasswordByEmailValidator },
      accountController.changePasswordByEmail
    );

    fastify.delete("/", accountController.delete);

    fastify.put(
      "/transport-type",
      { schema: updateTransportTypeValidator },
      accountController.updateTransportType
    );

    // //verify account
    fastify.post("/verify", accountController.verifyToken);
  };
}
