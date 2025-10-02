package services

import (
	"crashsaver/incident/data/model"
	repo "crashsaver/incident/internal/repository"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
)

type IncidentService struct {
	static           *repo.IncidentStaticRepository
	mobile           *repo.IncidentMobileRepository
	verifyIncidents  *repo.VerifyIncidentsRepository
	notificationUser *NotificationUser
}

func NewIncidentService(db *mongo.Database, notificationService *NotificationUser) *IncidentService {
	return &IncidentService{
		static:           repo.NewIncidentStatictRepository(db),
		mobile:           repo.NewIncidentMobileRepository(db),
		verifyIncidents:  repo.NewVerifyIncidentsRepository(db),
		notificationUser: notificationService,
	}
}

func (i *IncidentService) ListIncidents() (*[]model.IncidentStatic, *[]model.IncidentMobile, error) {
	var wg sync.WaitGroup
	wg.Add(2)

	var istatics *[]model.IncidentStatic
	var imobiles *[]model.IncidentMobile
	var err1, err2 error

	errChan := make(chan error, 2)

	go func() {
		defer wg.Done()
		istatics, err1 = i.static.GetAll(false)
		if err1 != nil {
			errChan <- err1
		}
	}()

	go func() {
		defer wg.Done()
		imobiles, err2 = i.mobile.GetAll()
		if err2 != nil {
			errChan <- err2
		}
	}()

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return nil, nil, err
		}
	}

	return istatics, imobiles, nil
}
