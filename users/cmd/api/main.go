package main

import (
	"appassistence/auth/internal/database"
	"appassistence/auth/internal/server"
	"appassistence/auth/pkg/authorization"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")
	fmt.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	db, err := database.NewPostgres()
	if err != nil {
		log.Fatalf("Error DB\n")
	}

	// my_middleware
	// redisHost := os.Getenv("REDIS_HOST")
	// redisPort := os.Getenv("REDIS_PORT")
	// passRedis := os.Getenv("PASSWORD_REDIS")
	// secretKey := os.Getenv("SECRETKEY")
	// if secretKey == "" {
	// 	log.Fatal("Secret key not set in environment variables")
	// }
	auth := authorization.NewAuthorization()
	router := server.NewRouter(e, db, auth)
	router.Start()

	e.HideBanner = true

	e.Logger.Fatal(e.Start(":" + port))
}
