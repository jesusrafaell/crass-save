package repository

import (
	"context"
	"crashsaver/incident/data/model"
	"crashsaver/incident/db"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type VerifyIncidentsRepository struct {
	collection *mongo.Collection
}

func NewVerifyIncidentsRepository(database *mongo.Database) *VerifyIncidentsRepository {
	return &VerifyIncidentsRepository{
		collection: database.Collection(db.CollectionVerifyIncidents),
	}
}

func (r *VerifyIncidentsRepository) Create(verify *model.VerifyIncident) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().Unix()
	verify.CreateTime = now
	verify.UpdateTime = now

	result, err := r.collection.InsertOne(ctx, &verify)
	if err != nil {
		return err
	}

	verify.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *VerifyIncidentsRepository) GetByID(id string) (model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return model.VerifyIncident{}, err
	}

	var verifyIncident model.VerifyIncident
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&verifyIncident)
	if err != nil {
		return model.VerifyIncident{}, err
	}

	return verifyIncident, nil
}

func (r *VerifyIncidentsRepository) GetVerifyIncidentByUserAndIncident(incidentId primitive.ObjectID, userId primitive.ObjectID) (*model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var verifyIncident model.VerifyIncident
	err := r.collection.FindOne(ctx, bson.M{"incident_id": incidentId, "user_id": userId}).Decode(&verifyIncident)
	if err != nil {
		return nil, err
	}

	return &verifyIncident, nil
}

func (r *VerifyIncidentsRepository) GetAll() (*[]model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var verifyIncidents []model.VerifyIncident
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var verifyIncident model.VerifyIncident
		if err = cursor.Decode(&verifyIncident); err != nil {
			return nil, err
		}
		verifyIncidents = append(verifyIncidents, verifyIncident)
	}

	if err = cursor.Err(); err != nil {
		return nil, err
	}

	return &verifyIncidents, nil
}

func (r *VerifyIncidentsRepository) GetVerificationsByUser(userID string) (*[]model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(ctx, bson.M{"user_id": objectID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var verifys []model.VerifyIncident
	if err = cursor.All(ctx, &verifys); err != nil {
		return nil, err
	}

	return &verifys, nil
}

func (r *VerifyIncidentsRepository) GetVerificationsByIncident(incidentID primitive.ObjectID) (*[]model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{"incident_id": incidentID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var verifys []model.VerifyIncident
	if err = cursor.All(ctx, &verifys); err != nil {
		return nil, err
	}

	return &verifys, nil
}

func (r *VerifyIncidentsRepository) GetByIncidentAndOption(incidentID primitive.ObjectID, option int) (*[]model.VerifyIncident, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"incident_id": incidentID}
	if option != -1 {
		filter["option"] = option
	}

	var incidentVerifications []model.VerifyIncident

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(context.TODO(), &incidentVerifications); err != nil {
		return nil, err
	}

	return &incidentVerifications, nil
}

func (r *VerifyIncidentsRepository) Update(id string, verify model.VerifyIncident) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().Unix()

	verify.UpdateTime = now

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.UpdateByID(ctx, objectID, bson.M{"$set": verify})
	return err
}

func (r *VerifyIncidentsRepository) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
