package model

type MessageFCM struct {
	FCMToken string `bson:"fcm_token, omitempty" json:"fcm_token,omitempty"`
	Title    string `bson:"title,omitempty" json:"title,omitempty"`
	Message  string `bson:"message,omitempty" json:"message,omitempty"`
	Sound    string `bson:"sound,omitempty" json:"sound,omitempty"`
}
