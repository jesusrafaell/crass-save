package main

import (
	"crashsaver/parking/internal/db"
	midd "crashsaver/parking/internal/middleware"
	"crashsaver/parking/internal/routes"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	dbp, err := db.NewPostgres(*db.ConfigPostgres())
	if err != nil {
		log.Fatal(err.Error())
	}

	e := echo.New()
	e.HideBanner = true

	env := os.Getenv("ENV")

	log.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	// Middlewares
	e.Use(midd.RegisterRequest)
	e.Use(midd.UserIdRequest)
	e.Use(midd.LangRequest)

	//routes & services
	routes.Initialization(e, dbp.DB)

	e.Logger.Fatal(e.Start(":" + port))
}
