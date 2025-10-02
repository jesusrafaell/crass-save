import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { UploadPhotoService } from "../../domain/services/uploadPhoto.service";
import { UploadedFile } from "express-fileupload";
import { DtoToken } from "../../../verifyToken/domain/model/token";

class UploadPhotoController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly uploadPhotoService = new UploadPhotoService(),
  ) {}

  public uploadPhoto = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();

      const photo = req.files?.photo as UploadedFile;

      if (!photo) {
        throw new Error(`FileNotFound`);
      }

      const result = await this.uploadPhotoService.uploadPhoto(
        user_id,
        photo,
      );

      return this.responseExpress.successResponse(res, {data: result});
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default UploadPhotoController;
