import { Router, Request } from "express";
import apicache from "apicache";

import {
  loginGuestValidation,
  loginTruckValidation,
  loginValidation,
} from "../../../../common/middlewares/auth/loginValidator";
import { registerValidator } from "../../../../common/middlewares/auth/registerValidator";
import { changePasswordValidation } from "../../../../common/middlewares/auth/changePasswordValidator";
import DeleteAccountController from "../../app/controller/deleteAccount.controller";
import LoginController from "../../app/controller/login.controller";
import SignupController from "../../app/controller/signup.controller";
import UpdateAccountController from "../../app/controller/updateAccount.controller";
import VerfifyAccountController from "../../app/controller/verifyAccount.controller";
import LogoutController from "../../app/controller/logout.controller";
import RecoverAcccountController from "../../app/controller/recoverAcccount.controller";
import {
  changePasswordByEmailValidator,
  forgetPasswordValidator,
  updateTransportTypeValidator,
} from "../../../../common/middlewares/auth/forgetPasswordValidator";

export class AccountRoutes {
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const loginController = new LoginController();
    const signupController = new SignupController();
    const logoutController = new LogoutController();
    const updateAccountController = new UpdateAccountController();
    const deleteAccountController = new DeleteAccountController();
    const recoverAcccountController = new RecoverAcccountController();
    const verifyAccountController = new VerfifyAccountController();

    /* login */
    router.post("/login", loginValidation, loginController.handler);
    router.post("/login/guest", loginGuestValidation, loginController.guest);
    router.post("/manager/login", loginValidation, loginController.manager);
    router.post("/login/truck", loginTruckValidation, loginController.truck);

    router.post("/logout", logoutController.handler);

    router.post("/register", registerValidator, signupController.hander);

    router.delete("/", deleteAccountController.hander);

    router.post(
      "/changePassword",
      changePasswordValidation,
      updateAccountController.changePassword,
    );

    router.post(
      "/forgot-password",
      forgetPasswordValidator,
      recoverAcccountController.forgotPasswordByEmail,
    );

    router.put(
      "/forgot-password",
      changePasswordByEmailValidator,
      recoverAcccountController.changePasswordByEmail,
    );

    router.put("/transport-type",
      updateTransportTypeValidator,
      updateAccountController.updateTransportType
    )

    //verify account
    router.post("/verify", verifyAccountController.handler);

    return router;
  }
}
