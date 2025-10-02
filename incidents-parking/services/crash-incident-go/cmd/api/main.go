package main

import (
	"crashsaver/incident/db"
	"crashsaver/incident/internal/api"
	"crashsaver/incident/internal/autotask"
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

	fmt.Printf("ENV: %s\n", env)
	dbName := os.Getenv("DB_NAME")

	//databse
	client := db.NewConnection()
	db := db.ConnectDB(client, dbName)

	port := os.Getenv("PORT")
	app := api.New(port, db)

	//auto task
	autotask.SetupScheduledTasks(db)

	app.Start()
}
