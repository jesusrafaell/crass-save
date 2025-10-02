package fcm

import (
	"context"
	"crashsaver/fcm/util"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func NewFcm() (*firebase.App, error) {
	decodedKey, err := util.GetDecodedFireBaseKey()
	// log.Println("decodedkey", decodedKey)

	if err != nil {
		return nil, err
	}

	opts := []option.ClientOption{option.WithCredentialsJSON(decodedKey)}

	// Initialize firebase app
	app, err := firebase.NewApp(context.Background(), nil, opts...)

	if err != nil {
		log.Fatalf("Error in initializing firebase app: %s", err)
		return nil, err
	}

	return app, nil
}
