package main

import (
	"api/gateway/cmd"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Error: %s", err)
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")
	port := os.Getenv("PORT")
	fmt.Printf("ENV: %s\n", env)

	gateway := cmd.NewGateway(env, port)
	gateway.RunGateway()
}
