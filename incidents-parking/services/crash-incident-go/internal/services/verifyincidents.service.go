package services

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"
	"crashsaver/incident/util"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (i *IncidentService) CreateVerifyIncident(req types.VerifyIncidentRequest) (*model.VerifyIncident, error) {
	incidentID, err := primitive.ObjectIDFromHex(req.IncidentID)
	if err != nil {
		return nil, err
	}

	verify := &model.VerifyIncident{
		UserID:     req.UserID,
		IncidentID: incidentID,
		Option:     req.Option,
	}

	err = i.verifyIncidents.Create(verify)

	if err != nil {
		//when user verificated incident
		if util.IsErrorDuplicateKey(err) {
			//add code
			return nil, fmt.Errorf("the user has already verified this incident")
		}
		return nil, fmt.Errorf("%s %v", "Error in CreteVerifyIncident: %v\n", err)
	}

	//valid max finish incident
	go i.checkAndResolveIncident(incidentID)

	return verify, nil

}

func (i *IncidentService) GetVerifysIncidentByUser(id string) (*[]model.VerifyIncident, error) {
	verifications, err := i.verifyIncidents.GetVerificationsByUser(id)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error in CreteVerifyIncident: %v\n", err)

	}

	return verifications, nil
}

func (i *IncidentService) GetVerifysIncidentByIncident(id string) (*[]model.VerifyIncident, error) {
	idMongo, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	verifications, err := i.verifyIncidents.GetVerificationsByIncident(idMongo)
	if err != nil {
		return nil, fmt.Errorf("%s %v", "Error in CreteVerifyIncident: %v\n", err)

	}

	return verifications, nil
}

func (i *IncidentService) checkAndResolveIncident(id primitive.ObjectID) error {
	verifications, err := i.verifyIncidents.GetByIncidentAndOption(id, model.Finish)
	if err != nil {
		return err
	}

	if len(*verifications) >= 5 {
		incident := model.IncidentStatic{
			Status: model.Resolved.Name,
		}
		err = i.static.UpdateById(id, &incident)
		if err != nil {
			return fmt.Errorf("error updating incident status: %w", err)
		}
	}

	return nil
}
