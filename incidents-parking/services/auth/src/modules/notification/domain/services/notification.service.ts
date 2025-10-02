import { StatusService } from "../../../status/domain/services/status.service";
import { LocationService } from "../../../location/domain/services/location.service";
import {
  NotificationUser,
  NotificationUserInRadius,
  UserLocation,
} from "../model/notificationUserInRadius";
import { UserService } from "../../../user/domain/services/user.services";
import NotificationClient from "../../../../common/adapters/fcmAdapter";
import { SendMessageFCMRequest } from "../../../../proto/fcm/service";
import { log } from "console";

export class NotificationService {
  private service!: NotificationClient;
  constructor(
    private readonly userService = new UserService(),
    private readonly statusService = new StatusService(),
    private readonly locationService = new LocationService()
  ) {}

  public notificationInRadius = async (
    data: NotificationUserInRadius
  ): Promise<number> => {
    try {
      const { latitude, longitude, radius } = data;
      //get UserId in radius

      const locations = await this.locationService.getInRadius({
        latitude,
        longitude,
        radius,
      });

      if (!locations.length) {
        return 0;
      }

      //get Data by User and active
      const userIds: string[] = [
        ...new Set(locations.map((location) => location.user_id)),
      ];

      const statusActive = await this.statusService.getByName("active");

      const users = await this.userService.getByIds(userIds);

      const filteredUsers = users.filter(
        (user) =>
          user.id_status === statusActive.id &&
          user.fcm_token &&
          user.id != data.userId
      );

      console.log("Incident Notification ", users.length);

      this.service = new NotificationClient();

      // Send notificacions
      const notificationPromises = filteredUsers.map((user) => {
        const request: SendMessageFCMRequest = {
          fcm: {
            fcmToken: user.fcm_token!,
            title: data.title,
            message: data.message,
            sound: data.sound,
          },
        };
        // console.log("FCM MSG:", { userId: user.id, token: user.fcm_token });

        return new Promise((resolve) => {
          this.service.client.sendMessageFcm(request, (err) => {
            if (err) {
              console.log(
                "Error send to userId:",
                user.id,
                "/data:",
                user.email ? user.email : user.last_name,
                ":",
                err
              );
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      });

      //waiting for all awnsers
      const results = await Promise.allSettled(notificationPromises);
      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      return successCount;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    } finally {
      this.service.close();
    }
  };

  public notification = async (data: NotificationUser): Promise<number> => {
    try {
      const { userId } = data;
      const statusActive = await this.statusService.getByName("active");
      const user = await this.userService.getById(userId);
      if (user)
        if (user.id_status === statusActive.id && user.fcm_token) {
          this.service = new NotificationClient();

          const request: SendMessageFCMRequest = {
            fcm: {
              fcmToken: user.fcm_token!,
              title: data.title,
              message: data.message,
              sound: data.sound,
            },
          };

          return new Promise((resolve) => {
            console.log("FCM", this.service.getServer());
            this.service.client.sendMessageFcm(request, (err) => {
              if (err) {
                console.log("Error send to", user.email, err);
                resolve(0);
              } else {
                resolve(1);
              }
            });
          });
        }

      return 0;
    } catch (err) {
      const _error = err as Error;
      console.log("Error FCM user", _error);
      throw new Error(_error.message);
    } finally {
      this.service.close();
    }
  };
}
