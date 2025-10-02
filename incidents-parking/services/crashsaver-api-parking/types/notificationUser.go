package types

import "github.com/google/uuid"

type NotificationUserRequest struct {
	Title   string    `json:"title"`
	Message string    `json:"message"`
	Sound   string    `json:"sound"`
	UserId  uuid.UUID `json:"userId"`
}
