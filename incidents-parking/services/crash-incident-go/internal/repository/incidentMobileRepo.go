package repository

import (
	"context"
	"crashsaver/incident/data/model"
	"crashsaver/incident/db"
	"crashsaver/incident/types"
	codeError "crashsaver/incident/util/errorCodes"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type IncidentMobileRepository struct {
	collection *mongo.Collection
}

func NewIncidentMobileRepository(database *mongo.Database) *IncidentMobileRepository {
	return &IncidentMobileRepository{
		collection: database.Collection(db.CollectionMobileincidents),
	}
}

func (r *IncidentMobileRepository) Create(incident *model.IncidentMobile) error {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	now := time.Now().Unix()
	incident.CreateTime = now
	incident.UpdateTime = now

	result, err := r.collection.InsertOne(ctx, &incident)
	if err != nil {
		return err
	}

	incident.ID = result.InsertedID.(primitive.ObjectID)

	return nil
}

func (r *IncidentMobileRepository) GetByID(id primitive.ObjectID) (*model.IncidentMobile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var incident model.IncidentMobile
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&incident)
	if err != nil {
		return nil, err
	}

	return &incident, nil
}

func (r *IncidentMobileRepository) GetByUserAndStatus(userId string, status string) (*model.IncidentMobile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var incident model.IncidentMobile

	filter := bson.M{
		"user_id": userId,
		"status":  status,
	}

	err := r.collection.FindOne(ctx, filter).Decode(&incident)

	if err != nil {
		return nil, err
	}

	return &incident, nil
}

func (r *IncidentMobileRepository) UpdateLocationById(id primitive.ObjectID, location model.Point) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().Unix()

	update := bson.M{
		"$set": bson.M{
			"location":   location,
			"updated_at": now,
		},
	}

	result, err := r.collection.UpdateByID(ctx, id, update)

	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf(codeError.NewCustomError("incidentNotFound").Code)
	}

	return nil
}

func (r *IncidentMobileRepository) UpdateStatusById(id string, status string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	now := time.Now().Unix()

	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": now,
		},
	}

	result, err := r.collection.UpdateByID(ctx, objectID, update)

	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf(codeError.NewCustomError("incidentNotFound").Code)
	}

	return nil
}

func (r *IncidentMobileRepository) GetAll() (*[]model.IncidentMobile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var incidents []model.IncidentMobile
	if err = cursor.All(ctx, &incidents); err != nil {
		return nil, err
	}

	return &incidents, nil
}

func (r *IncidentMobileRepository) GetNearIncidents(data types.GetNearIncidentRequest) (*[]model.IncidentMobile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var incidents []model.IncidentMobile

	filter := bson.M{
		"location": bson.M{
			"$nearSphere": bson.M{
				"$geometry": bson.M{
					"type":        "Point",
					"coordinates": []float64{data.Longitude, data.Latitude},
				},
				"$maxDistance": data.Radius,
			},
		},
		"status":  bson.M{"$ne": "resolved"},
		"user_id": bson.M{"$ne": data.UserID},
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error finding incidents (Mobile GetNearIncidents):", err)
	}

	defer cursor.Close(ctx)

	if err = cursor.All(context.TODO(), &incidents); err != nil {
		return nil, fmt.Errorf("%s %v", "Error finding incidents (Mobile GetNearIncidents):", err)
	}

	return &incidents, nil
}
