package main

import (
	"authorization/app"
	"authorization/server"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")
	log.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	grpcAddr := flag.String("grpc", fmt.Sprintf(":%s", port), "listen address of the grpc transport")

	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	app := app.NewAuthorization(redisHost, redisPort)

	err := server.GRPCServerAndRun(*grpcAddr, *app)

	if err != nil {
		log.Printf("Error in run grpc: %v\n", err)
	}
}
