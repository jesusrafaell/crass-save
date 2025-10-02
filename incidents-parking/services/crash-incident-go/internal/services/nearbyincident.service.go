package services

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"

	"go.mongodb.org/mongo-driver/mongo"
)

func (i *IncidentService) GetNearbyIncidents(req types.GetNearIncidentRequest) (*model.IncidentsRadiusResponse, error) {
	req.MatchUser = false
	incidents, err := i.static.GetNearIncidents(req)
	if err != nil {
		return nil, err
	}
	setVerifyUserFlag(incidents)

	req.MatchUser = true
	myIncidents, err := i.static.GetNearIncidents(req)
	if err != nil {
		return nil, err
	}
	setVerifyUserFlag(myIncidents)

	incidentsMobiles, err := i.mobile.GetNearIncidents(req)
	if err != nil {
		return nil, err
	}

	myIncidentMobile, err := i.mobile.GetByUserAndStatus(req.UserID, model.Active.Name)
	if err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}

	incidentsNearby := &model.IncidentsRadiusResponse{
		Incidents:        incidents,
		MyIncidents:      myIncidents,
		IncidentsMobiles: incidentsMobiles,
		MyIncidentMobile: myIncidentMobile,
	}

	return incidentsNearby, nil
}

func setVerifyUserFlag(incidents *[]model.IncidentStaticNearby) {
	for _, item := range *incidents {
		if item.Distance > float64(100) {
			item.VerifyUser = false
		}
	}
}
