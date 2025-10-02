package initializations

import (
	"context"
	"crashsaver/incident/util"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateCollecionVerifyIncidents(db *mongo.Database, collecionName string) error {
	ctx, cancel := context.WithTimeout(context.TODO(), 5*time.Second)
	defer cancel()
	exist, err :=
		util.CollectionExists(db, collecionName)
	if err != nil {
		return fmt.Errorf("error checking if collection exists: %v", err)
	}

	if !exist {
		collection := db.Collection(collecionName)

		indexModel := mongo.IndexModel{
			Keys: bson.D{
				{Key: "user_id", Value: 1},
				{Key: "incident_id", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		}

		_, err := collection.Indexes().CreateOne(ctx, indexModel)
		if err != nil {
			log.Fatalf("Failed to create %s unique compound index: %v\n", collecionName, err)
		}
	}

	return nil
}
