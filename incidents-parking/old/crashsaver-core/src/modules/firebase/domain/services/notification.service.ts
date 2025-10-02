import adminApp from "../../infra/firebaseConfig";

export class NotificationService {
  async sendPushNotification(
    registrationToken: string,
    title: string,
    body: string,
  ) {
    const message = {
      token: registrationToken,
      notification: {
        title,
        body,
      },
    };

    try {
      const response = await adminApp.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendPushNotificationAll(topic: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      topic: topic,
    };

    try {
      const response = await adminApp.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
