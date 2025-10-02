package notification

import "github.com/google/uuid"

type Notification struct {
	FCMToken string `json:"fcmToken"`
	Title    string `json:"title"`
	Message  string `json:"message"`
	Sound    string `json:"sound"`
	Channel  string `json:"channel"`
}

type NotificationUser struct {
	UserId  uuid.UUID `json:"userId"`
	Title   string    `json:"title"`
	Message string    `json:"message"`
	Sound   string    `json:"sound"`
}
