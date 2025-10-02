import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { Version } from "../../domain/model/version";
import { VersionService } from "../../domain/services/version.services";

class VersionsController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly versionsService = new VersionService(),
  ) {}

  public get = async (req: Request, res: Response) => {
    try {
      const result = await this.versionsService.get();
        return this.responseExpress.successResponse(res, { data: result });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
        //version data
      const id = req.params.id;
      const version = req.body as Partial<Version>;
      const result = await this.versionsService.update(id, version);
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default VersionsController;
