package services

import (
	"context"
	model "crashsaver/fcm/data"
	"crashsaver/fcm/internal/fcm"
	"fmt"
	"log"

	"firebase.google.com/go/messaging"
)

type FCMService interface {
	SendFCM(context.Context, model.MessageFCM) (*model.MessageFCM, error)
}

type fcmService struct {
	fcm       fcm.FcmClient
	channelID string
}

func NewFCMService(fcm fcm.FcmClient, channelID string) *fcmService {
	return &fcmService{
		fcm,
		channelID,
	}
}

func (f *fcmService) SendFCM(ctx context.Context, fcm model.MessageFCM) (*model.MessageFCM, error) {
	message := &messaging.Message{
		Notification: &messaging.Notification{
			Title: fcm.Title,
			Body:  fcm.Message,
		},
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Sound:     fmt.Sprintf("%s.%s", fcm.Sound, "mp3"),
				ChannelID: f.channelID,
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
	response, err := f.fcm.Client.Send(ctx, message)

	if err != nil {
		return nil, err
	}

	log.Println("response", response)

	return &fcm, nil
}
