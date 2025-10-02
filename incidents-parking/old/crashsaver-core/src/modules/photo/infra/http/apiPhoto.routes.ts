import { Router, Request } from "express";
import apicache from "apicache";
import UploadPhotoController from "../../app/controller/uploadPhoto.controller";

export class PhotoRoutes {
  static get routes(): Router {
    const router = Router();
    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const _uploadPhotoController = new UploadPhotoController();

    // crud
    router.post("/upload", _uploadPhotoController.uploadPhoto);

    return router;
  }
}
