package server

import (
	"crashsaver/fcm/internal/fcm"
	"crashsaver/fcm/internal/services"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func NewServer() {

	//env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")
	log.Printf("MODE: %s\n", env)

	// uriRead := os.Getenv("MONGO_URL_CONNECTION_READ")

	port := os.Getenv("PORT")

	grpcAddr := flag.String("grpc", fmt.Sprintf(":%s", port), "listen address of the grpc transport")

	//init fcm
	app, err := fcm.StartClient()

	if err != nil {
		log.Fatalf("Error in run app firabase: %v\n", err)
	}

	fcm := fcm.NewFcmClient(app)

	channelID := os.Getenv("CHANNEL_ID")

	svc := services.NewFCMService(*fcm, channelID)

	err = GRPCServerAndRun(*grpcAddr, svc)

	if err != nil {
		log.Printf("Error in run grpc: %v\n", err)
	}
}
