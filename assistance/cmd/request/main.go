package main

import (
	"log"
	"os"

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

	log.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	//databse
	// gormDB, err := db.NewConnectionDB()
	// if err != nil {
	// 	log.Fatalf("Error connect gormDB %v\n", err)
	// }

	// pg, err := db.NewPostgres()
	// if err != nil {
	// 	log.Fatalf("Error connect db %v\n", err)
	// }

	// only get service and find driver
	//instance services
	// routes.Routes(e, gormDB, pg)

	e.Logger.Fatal(e.Start(":" + port))
}
