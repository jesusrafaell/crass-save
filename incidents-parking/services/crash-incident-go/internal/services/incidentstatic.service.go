package services

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"
	"crashsaver/incident/util"
	codeError "crashsaver/incident/util/errorCodes"
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (i *IncidentService) CreateIncidentStatic(req types.IncidentStaticRequest) (*model.IncidentStatic, *codeError.CustomError) {

	incident := model.IncidentStatic{
		Description:  req.Description,
		IncidentType: "1",
		Location: model.Point{
			Type:        "Point",
			Coordinates: []float64{req.Longitude, req.Latitude},
		},
		UserID: req.UserID,
		Status: model.Active.Name,
	}

	//valid incident nearby (100 meters)
	if req.DriveAssist == nil || !*req.DriveAssist {
		validNearby := &types.GetNearIncidentRequest{
			Latitude:  incident.Location.Coordinates[1],
			Longitude: incident.Location.Coordinates[0],
			Radius:    100,
			MatchUser: false,
		}
		nearby, err := i.static.GetNearIncidents(*validNearby)
		if err != nil && !strings.Contains(err.Error(), "NamespaceNotFound") {
			return nil, codeError.NewCustomError("incidentExist")
		}

		if err == nil && len(*nearby) > 0 {
			return nil, codeError.NewCustomError("incidentExist")
		}
	}

	//save repo
	err := i.static.Create(&incident)
	if err != nil {
		return nil, codeError.NewCustomError("incidentNotFound")
	}

	notification := types.NotificationUserRequest{
		Latitude:  incident.Location.Coordinates[1],
		Longitude: incident.Location.Coordinates[0],
		Radius:    1000, //1km
		Title:     "Nueva Incidencia",
		Message:   "Se ha creado una nueva incidencia cerca de ti",
		Sound:     "notification", //alert
		UserId:    incident.UserID,
	}

	go i.notificationUser.SendNotification(notification)

	return &incident, nil
}

func (i *IncidentService) GetIncidentStaticById(id string) (*model.IncidentStatic, error) {
	idMongo, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	incident, err := i.static.GetByID(idMongo)

	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error GetIncidentStatic: %v", err)
	}

	return incident, nil

}

func (i *IncidentService) ListIncidentStatic() (*[]model.IncidentStatic, error) {
	incidents, err := i.static.GetAll(false)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error ListIncident: %v", err)
	}

	return incidents, nil
}

func (i *IncidentService) UpdateIncidentStatic(id string, req types.UpdateIncidentRequest) error {
	idMongo, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	incident := model.IncidentStatic{}

	if req.Status != 0 {
		incident.Status = util.ConvertStatusToName(req.Status)
	}

	if req.Icon != 0 {
		incident.Icon = req.Icon
	}

	err = i.static.UpdateById(idMongo, &incident)
	if err != nil {
		return fmt.Errorf(codeError.NewCustomError("incidentNotFound").Code)
	}

	return nil
}

func (i *IncidentService) GetNearbyIncidentsStatic(req types.GetNearIncidentRequest, filterUser string) (*[]model.IncidentStaticNearby, error) {
	incidents, err := i.static.GetNearIncidents(req)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error GetNearbyIncidentsStatic: %v", err)
	}

	return incidents, nil
}
