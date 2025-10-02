import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
// import { DeleteVerifyIncidentService } from "../../domain/services/deleteVerifyIncident.service";

class DeleteVerifyIncidentController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    // private readonly deleteverifyIncidentService = new DeleteVerifyIncidentService(),
  ) {}

  // public deleteVerifyIncident = async (req: Request, res: Response) => {
  //   try {
  //     const { id } = req.body;
  //     await this.deleteverifyIncidentService.deleteVerifyIncident(id);

  //     return this.responseExpress.successResponse(res, {
  //       message: "verifyIncident deleted",
  //     });
  //   } catch (error) {
  //     return this.responseExpress.errorResponse(res, error as Error);
  //   }
  // };
}

export default DeleteVerifyIncidentController;
