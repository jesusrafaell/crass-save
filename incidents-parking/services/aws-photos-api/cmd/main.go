package main

import (
	"crashsaver/photos/handlers"
	"crashsaver/photos/internal/services"
	"crashsaver/photos/middleware"
	"crashsaver/photos/routes"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	//load
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")
	port := os.Getenv("PORT")
	log.Printf("MODE: %s\n", env)

	//server
	e := echo.New()

	e.Use(middleware.UserIdRequest)
	e.Use(middleware.RegisterRequest)

	photoService := services.NewUploadPhotoService()
	routes.UploadPhoto(e, handlers.NewUploadPhotoHandler(*photoService))

	e.HideBanner = true
	e.Logger.Fatal(e.Start(":" + port))
}
