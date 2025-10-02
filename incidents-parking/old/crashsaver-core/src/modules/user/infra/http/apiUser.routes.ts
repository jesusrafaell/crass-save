import { Router, Request } from "express";
import apicache from "apicache";
import UpdateUserController from "../../app/controller/updateUser.controller";
import CreateUserController from "../../app/controller/createUser.controller";
import GetUserController from "../../app/controller/getUser.controller";
import DeleteUserController from "../../app/controller/deleteUser.controler";
import { udpateFCMTokenValidator } from "../../../../common/middlewares/user/UpdateFCMToken";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const _createUserController = new CreateUserController();
    const _updateUserController = new UpdateUserController();
    const _getUserController = new GetUserController();
    const _deleteUserController = new DeleteUserController();

    // crud
    router.get("/data/:userId", _getUserController.getUserById);
    router.put("/data/:userId", _updateUserController.updateUserById);
    // router.delete("/data/:userId", _dyanleteUserController.deleteUser);

    router.get("/data", _getUserController.getUser);
    router.post("/all", _getUserController.getAllUsers);

    router.put(
      "/fcm_token",
      udpateFCMTokenValidator,
      _updateUserController.updateUser,
    );

    return router;
  }
}
