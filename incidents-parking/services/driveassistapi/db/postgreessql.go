package db

import (
	"fmt"
	"log"
	"os"

	"github.com/fatih/color"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewConnectionDB() (*gorm.DB, error) {
	host := os.Getenv("POSTGREESQL_URL_HOST")
	port := os.Getenv("POSTGREESQL_PORT")
	user := os.Getenv("POSTGREESQL_USER")
	password := os.Getenv("POSTGREESQL_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	//local
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s",
		host,
		port,
		user,
		password,
		dbname)

	//db
	// dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
	// host,
	// port,
	// user,
	// password,
	// dbname)

	// log.Println(dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Error getting generic database object: %v", err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}

	color.Cyan("⛁ POSTGREES connected!")

	return db, nil
}
