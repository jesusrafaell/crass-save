import { LocationRoutes } from "../modules/location/infrastructure/http/location.routes";
import { AccountRoutes } from "../modules/account/infraestructure/http/account.routes";
import { UserRoutes } from "../modules/user/infraestructure/http/user.routes";
import { VerifyTokenRoutes } from "../modules/verifyToken/infraestructure/http/verifytoken.routes";
import { StatusRoutes } from "../modules/status/infrastructure/http/status.routes";
import { SessionRoutes } from "../modules/session/infrastructure/http/session.routes";
import { NotificationRoutes } from "../modules/notification/infrastructure/http/notification.routes";
import { VersionRoutes } from "../modules/version/infra/http/apiVersion.routes";
import { EmailRoutes } from "../modules/email/infrastructure/http/email.routes";

export {
  LocationRoutes as Location,
  AccountRoutes as Account,
  UserRoutes as User,
  VerifyTokenRoutes as VerifyToken,
  StatusRoutes as Status,
  SessionRoutes as Session,
  NotificationRoutes as NotificationUser,
  VersionRoutes as Version,
  EmailRoutes as Email,
};
