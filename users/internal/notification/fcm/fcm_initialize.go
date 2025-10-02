package FCM

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func NewFirabase() *firebase.App {
	opt := option.WithCredentialsFile("./firabase/serviceAccountKey.json")
	dbURL := os.Getenv("FCM_DB_URL")
	config := &firebase.Config{DatabaseURL: dbURL}
	app, err := firebase.NewApp(context.Background(), config, opt)

	if err != nil {
		panic(err)
	}

	fmt.Println("Firebase project initialized successfully!")

	return app
}
