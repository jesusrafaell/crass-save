package server

import (
	"crashsaver/fcm/internal/services"
	"crashsaver/fcm/pkg/fcm"
	"crashsaver/fcm/pkg/twilio_otp"
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

	//init client services
	fcmClient := fcm.NewFcmClient(app)
	twilioClient := twilio_otp.NewTwilio()

	svc := services.NewService(fcmClient, twilioClient)

	err = GRPCServerAndRun(*grpcAddr, *svc)

	if err != nil {
		log.Printf("Error in run grpc: %v\n", err)
	}
}
