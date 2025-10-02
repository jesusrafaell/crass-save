package model

type MessageFCM struct {
	FCMToken  string `json:"fcm_token"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	Sound     string `json:"sound,omitempty"`
	ChannelID string `json:"channelId,omitempty"`
}
