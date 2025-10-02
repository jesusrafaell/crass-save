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
		log.Fatal("Error loading .env file")
	}
	docker := true
	if len(os.Args) > 1 {
		param := os.Args[1]
		// fmt.Printf("Arg: %s", param)
		if param == "dev" {
			docker = false
		}
	}

	env := os.Getenv("ENV")
	port := os.Getenv("PORT")
	fmt.Printf("MODE: %s | Network: %t\n", env, docker)

	gateway := cmd.NewGateway(env, port, docker)
	gateway.Start()
}
