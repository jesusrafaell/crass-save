package db

import (
	"fmt"
	"log"
	"os"

	"github.com/fatih/color"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

func NewConnectionDB() (*gorm.DB, error) {
	host := os.Getenv("POSTGREESQL_URL_HOST")
	port := os.Getenv("POSTGREESQL_PORT")
	user := os.Getenv("POSTGREESQL_USER")
	password := os.Getenv("POSTGREESQL_PASSWORD")
	dbname := os.Getenv("POSTGREESQL_NAME")

	//local
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s",
		host,
		port,
		user,
		password,
		dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "a_",
			SingularTable: false,
		},
		Logger: logger.Default.LogMode(logger.Silent),
		// Logger: logger.New(
		// 	log.New(os.Stdout, "\r\n", log.LstdFlags), // Salida al terminal
		// 	logger.Config{
		// 		SlowThreshold: time.Second, // Umbral para consultas lentas
		// 		LogLevel:      logger.Info, // Nivel de logging, se puede usar logger.Silent, logger.Error, logger.Warn, logger.Info
		// 		Colorful:      true,        // Colorear la salida de las consultas
		// 	},
		// ),
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
