package util

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func CollectionExists(db *mongo.Database, collectionName string) (bool, error) {
	collections, err := db.ListCollectionNames(context.Background(), bson.M{"name": collectionName})
	if err != nil {
		return false, err
	}
	return len(collections) > 0, nil
}
