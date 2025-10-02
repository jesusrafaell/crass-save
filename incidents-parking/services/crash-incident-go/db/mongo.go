package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ClientsMongo struct {
	Read  *mongo.Client
	Write *mongo.Client
}

func NewConnectionMongo(uriRead string, uriWrite string) *ClientsMongo {
	clientOptionsRead := options.Client().ApplyURI(uriRead)
	clientOptionsWrite := options.Client().ApplyURI(uriWrite)

	clientRead, err := mongo.Connect(context.TODO(), clientOptionsRead)
	if err != nil {
		fmt.Printf("⛒ Connection Failed to Mongo Read ping")
		log.Fatal(err)
	}

	// Check the connection read
	err = clientRead.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Printf("⛒ Connection Failed to Mongo Read ping")
		log.Fatal(err)
	}

	fmt.Printf("⛁ Connected to Mongo Read")

	clientWrite, err := mongo.Connect(context.TODO(), clientOptionsWrite)
	if err != nil {
		fmt.Printf("⛒ Connection Failed to Mongo Write ping")
		log.Fatal(err)
	}

	// Check the connection write
	err = clientWrite.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Printf("⛒ Connection Failed to Mongo Write ping")
		log.Fatal(err)
	}

	fmt.Printf("⛁ Connected to Mongo Write")

	return &ClientsMongo{
		Read:  clientRead,
		Write: clientWrite,
	}
}

func NewConnection() *mongo.Client {
	uri := os.Getenv("MONGO_URL_CONNECTION")

	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Printf("Connection Failed to Mongo ping\n")
		log.Fatal(err)
	}

	// Check the connection read
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Printf("Connection Failed to Mongo ping\n")
		log.Fatal(err)
	}

	fmt.Printf("Connected to Mongo db\n")

	return client
}
