package repository

import (
	"context"
	"crashsaver/incident/data/model"
	"crashsaver/incident/db"
	"crashsaver/incident/types"
	codeError "crashsaver/incident/util/errorCodes"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type IncidentStaticRepository struct {
	collection *mongo.Collection
}

func NewIncidentStatictRepository(database *mongo.Database) *IncidentStaticRepository {
	return &IncidentStaticRepository{
		collection: database.Collection(db.CollectionStaticIncidents),
	}
}

func (r *IncidentStaticRepository) Create(incident *model.IncidentStatic) error {
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

func (r *IncidentStaticRepository) GetByID(id primitive.ObjectID) (*model.IncidentStatic, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var incident model.IncidentStatic

	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&incident)
	if err != nil {
		return nil, err
	}

	return &incident, nil
}

func (r *IncidentStaticRepository) UpdateById(id primitive.ObjectID, incident *model.IncidentStatic) error {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	updateFields := bson.M{}
	if incident.Status != "" {
		updateFields["status"] = incident.Status
	}
	if incident.Icon != 0 {
		updateFields["icon"] = incident.Icon
	}

	if len(updateFields) == 0 {
		return fmt.Errorf("ERROR_UPDATE")
	}

	now := time.Now().Unix()
	updateFields["updated_at"] = now

	update := bson.M{
		"$set": updateFields,
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

func (r *IncidentStaticRepository) GetAll(filterStatus bool) (*[]model.IncidentStatic, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var filter bson.M
	if filterStatus {
		filter = bson.M{"status": bson.M{"$ne": "resolved"}}
	} else {
		filter = bson.M{} // Sin filtro, se devolverán todos los incidentes
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var incidents []model.IncidentStatic
	if err = cursor.All(ctx, &incidents); err != nil {
		return nil, err
	}

	return &incidents, nil
}

func (r *IncidentStaticRepository) GetNearIncidents(data types.GetNearIncidentRequest) (*[]model.IncidentStaticNearby, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := []bson.M{
		{
			"$geoNear": bson.M{
				"near": bson.M{
					"type":        "Point",
					"coordinates": []float64{data.Longitude, data.Latitude},
				},
				"distanceField": "distance",
				"maxDistance":   data.Radius,
				"spherical":     true,
			},
		}, {
			"$match": bson.M{
				"status": bson.M{"$ne": "resolved"},
			},
		},
	}

	if data.UserID != "" {
		lookupVerify := bson.M{
			"$lookup": bson.M{
				"from": "verifyincidents",
				"let":  bson.M{"incidentId": "$_id", "userId": data.UserID},
				"pipeline": bson.A{
					bson.M{
						"$match": bson.M{
							"$expr": bson.M{
								"$and": bson.A{
									bson.M{"$eq": bson.A{"$incident_id", "$$incidentId"}},
									bson.M{"$eq": bson.A{"$user_id", "$$userId"}},
								},
							},
						},
					},
				},
				"as": "verification",
			},
		}
		pipeline = append(pipeline, lookupVerify)

		if data.MatchUser {
			matchUser := bson.M{"$match": bson.M{"user_id": data.UserID}}
			pipeline = append(pipeline, matchUser)
		} else {
			matchUser := bson.M{
				"$match": bson.M{"user_id": bson.M{"$ne": data.UserID}}}
			pipeline = append(pipeline, matchUser)
		}
	}

	projectIncidentNear := bson.M{
		"$project": bson.M{
			"_id":              1,
			"description":      1,
			"status":           1,
			"location":         1,
			"incident_type_id": 1,
			"user_id":          1,
			"created_at":       1,
			"updated_at":       1,
			"icon":             1,
			"distance":         1,
			"verify_user": bson.M{
				"$cond": bson.M{
					"if":   bson.M{"$gt": bson.A{bson.M{"$size": "$verification"}, 0}},
					"then": false,
					"else": true,
				},
			},
		},
	}
	pipeline = append(pipeline, projectIncidentNear)

	cursor, err := r.collection.Aggregate(ctx, pipeline)

	if err != nil {
		log.Printf("%s %v", "Error finding incidents (Static GetNearIncidents):", err)
		return nil, err
	}

	defer cursor.Close(ctx)

	var incidents []model.IncidentStaticNearby

	if err = cursor.All(ctx, &incidents); err != nil {
		log.Printf("%s %v", "Error retrieving incidents from cursor (Static GetNearIncidents):", err)
		return nil, err
	}

	return &incidents, nil
}

func (repo *IncidentStaticRepository) UpdateAllIncidentsStatus(hours int) (int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	expired := time.Now().Add(-time.Duration(hours) * time.Hour).Unix()

	//for test
	// expired := time.Now().Add(-3 * time.Minute).Unix()

	filter := bson.M{
		"updated_at": bson.M{"$lt": expired},
		"status":     model.Active.Name,
	}

	log.Printf("Exec lt expired: %d", expired)

	now := time.Now().Unix()
	update := bson.M{
		"$set": bson.M{"status": model.Resolved.Name, "updated_at": now},
	}

	result, err := repo.collection.UpdateMany(ctx, filter, update)
	if err != nil {
		return 0, fmt.Errorf("error updating incidents status to resolved: %w", err)
	}

	if result.MatchedCount == 0 {
		return 0, fmt.Errorf("no incidents found with the provided IDs")
	}

	return result.ModifiedCount, nil
}
