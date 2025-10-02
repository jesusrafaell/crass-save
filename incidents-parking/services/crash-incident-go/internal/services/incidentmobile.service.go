package services

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"
	"crashsaver/incident/util"
	codeError "crashsaver/incident/util/errorCodes"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (i *IncidentService) CreateIncidentMobile(req types.IncidentMobileRequest) (*model.IncidentMobile, *codeError.CustomError) {
	_, err := i.mobile.GetByUserAndStatus(req.UserID, model.Active.Name)

	//user have incident active
	if err == nil || err != mongo.ErrNoDocuments {
		return nil, codeError.NewCustomError("incidentMobileActive")
	}

	incident := model.IncidentMobile{
		Location: model.Point{
			Type:        "Point",
			Coordinates: []float64{req.Longitude, req.Latitude},
		},
		UserID:       req.UserID,
		Status:       model.Active.Name,
		TransportKey: req.TransportID,
	}

	err = i.mobile.Create(&incident)
	if err != nil {
		return nil, codeError.NewCustomError("incidentNotFound")
	}

	return &incident, nil
}

func (i *IncidentService) GetIncidentMobile(id string) (*model.IncidentMobile, error) {
	idMongo, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	incident, err := i.mobile.GetByID(idMongo)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error GetIncidentMobile: %v", err)
	}

	return incident, nil
}

func (i *IncidentService) UpdateIncidentLocationMobile(id string, req types.UpdateLocationIncidentRequest) error {
	idMongo, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	point := model.Point{
		Type:        "Point",
		Coordinates: []float64{req.Longitude, req.Latitude},
	}

	err = i.mobile.UpdateLocationById(idMongo, point)

	if err != nil {
		return fmt.Errorf("%s %v", "Error UpdateIncidentLocationMobile: %v", err)
	}

	return nil
}

func (i *IncidentService) UpdateStatusMobile(id string, status int32) error {
	statusName := util.ConvertStatusToName(status)
	err := i.mobile.UpdateStatusById(id, statusName)
	if err != nil {
		return fmt.Errorf("%s %v", "Error UpdateStatusLocationMobile: %v", err)
	}

	return nil
}

func (i *IncidentService) ListIncidentMobile() (*[]model.IncidentMobile, error) {
	incidents, err := i.mobile.GetAll()
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error ListIncident: %v", err)
	}

	return incidents, nil
}

func (i *IncidentService) GetNearbyIncidentsMobile(nearData types.GetNearIncidentRequest) (*[]model.IncidentMobile, error) {
	incidents, err := i.mobile.GetNearIncidents(nearData)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error GetNearbyIncidentsMobile: %v", err)
	}

	return incidents, nil
}
