package services

import (
	"context"
	model "crashsaver/fcm/data"
	"fmt"
	"log"
	"time"

	"firebase.google.com/go/messaging"
)

func (f *Service) SendFCM(ctx context.Context, fcm model.MessageFCM) (*model.MessageFCM, error) {
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
	ctxFCM, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	response, err := f.fcm.Client.Send(ctxFCM, message)

	if err != nil {
		log.Printf("Error serivces.SendFCM: %v", err)
		return nil, err
	}

	log.Println("response", response)

	return &fcm, nil
}
