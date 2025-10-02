package fcm

import (
	"context"

	"firebase.google.com/go/messaging"
)

type FcmClient struct {
	Client *messaging.Client
}

func NewFcmClient(client *messaging.Client) *FcmClient {
	return &FcmClient{
		Client: client,
	}
}

func StartClient() (*messaging.Client, error) {
	app, err := NewFcm()

	if err != nil {
		return nil, err
	}

	client, err := app.Messaging(context.Background())
	if err != nil {
		return nil, err
	}
	return client, nil
}
