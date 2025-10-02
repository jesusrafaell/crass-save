package db

import (
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
)

type DB = *mongo.Database

func ConnectDB(client *mongo.Client, dbName string) *mongo.Database {
	db := client.Database(dbName)
	fmt.Printf("Connected to Collection mongo\n")

	return db
}
