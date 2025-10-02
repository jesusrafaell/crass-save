package main

import (
	"fmt"
	"log"
	"os"

	"bitbucket.org/mya/mya-assistance-core/internal/db"
	routes "bitbucket.org/mya/mya-assistance-core/internal/server"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.HideBanner = true
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")

	fmt.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	gormDB, err := db.NewConnectionDB()
	if err != nil {
		log.Fatalf("Error connect gormDB %v\n", err)
	}

	pg, err := db.NewPostgres()
	if err != nil {
		log.Fatalf("Error connect db %v\n", err)
	}

	routes.Routes(e, gormDB, pg)

	e.Logger.Fatal(e.Start(":" + port))
}
