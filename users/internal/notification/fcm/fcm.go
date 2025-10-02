package FCM

import (
	"context"
	"fmt"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/messaging"
)

type MessageFCM struct {
	FCMToken  string `json:"fcm_token"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	Sound     string `json:"sound,omitempty"`
	ChannelID string `json:"channelId,omitempty"`
}

type Fcm struct {
	Client *messaging.Client
}

func NewFCM(app *firebase.App) *Fcm {
	client, err := app.Messaging(context.Background())
	if err != nil {
		log.Panicf("Error in run app firabase: %v\n", err)
	}

	return &Fcm{
		Client: client,
	}
}

func (f *Fcm) Send(ctx context.Context, fcm MessageFCM) error {
	message := &messaging.Message{
		Notification: &messaging.Notification{
			Title: fcm.Title,
			Body:  fcm.Message,
		},
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Sound:     fmt.Sprintf("%s.%s", fcm.Sound, "mp3"),
				ChannelID: fcm.ChannelID,
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Alert: &messaging.ApsAlert{
						Title: fcm.Title,
						Body:  fcm.Message,
					},
					Sound: fmt.Sprintf("%s.%s", fcm.Sound, "mp3"),
				},
			},
		},
		Token: fcm.FCMToken,
	}

	//send
	response, err := f.Client.Send(ctx, message)
	if err != nil {
		log.Println("Error SendFCM:", err)
		return err
	}

	log.Println("Response SendFCM:", response)

	return nil
}
