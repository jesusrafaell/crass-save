package db

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Config struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

func ConfigPostgres() *Config {
	return &Config{
		Host:     os.Getenv("POSTGREESQL_URL_HOST"),
		Port:     os.Getenv("POSTGREESQL_PORT"),
		User:     os.Getenv("POSTGREESQL_USER"),
		Password: os.Getenv("POSTGREESQL_PASSWORD"),
		DBName:   os.Getenv("DB_NAME"),
	}
}

type Sqlx struct {
	DB *sqlx.DB
}

func NewPostgres(cfg Config) (*Sqlx, error) {
	port, err := strconv.Atoi(cfg.Port)
	if err != nil {
		log.Fatalf("Error al convertir el puerto de POSTGRES_PORT a int: %v", err)
	}
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=require",
		cfg.Host, port, cfg.User, cfg.Password, cfg.DBName)

	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, err
	}

	fmt.Println("Postgress connect")

	return &Sqlx{DB: db}, nil
}
