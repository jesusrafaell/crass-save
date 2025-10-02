package main

import (
	"api/driveassist/db"
	"api/driveassist/internal/migration/migrate"
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

	//databse
	db, err := db.NewConnectionDB()

	if err != nil {
		log.Fatalf("Error connect db %v\n", err)
	}

	migrate.RunDropTables(db)
	migrate.RunMigrate(db)
}

//add extension for uuid
//CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
