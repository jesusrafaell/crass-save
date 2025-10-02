package util

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"
	"sync"
)

func ConvertIncidentsAll(istatics *[]model.IncidentStatic, imobiles *[]model.IncidentMobile) ([]types.IncidentResponseData, []types.IncidentMobileResponse, error) {
	var wg sync.WaitGroup
	wg.Add(2) // Prepararse para esperar dos goroutines

	// Canales para recoger los resultados procesados
	staticResChan := make(chan []types.IncidentResponseData, 1)
	mobileResChan := make(chan []types.IncidentMobileResponse, 1)

	go func() {
		defer wg.Done()
		staticRes := []types.IncidentResponseData{}
		for _, i := range *istatics {
			staticRes = append(staticRes, *ConvertIncidentResponseData(&i))
		}
		staticResChan <- staticRes
	}()

	go func() {
		defer wg.Done()
		mobileRes := []types.IncidentMobileResponse{}
		for _, i := range *imobiles {
			mobileRes = append(mobileRes, *ConvertIncidentMobileResponse(&i))
		}
		mobileResChan <- mobileRes
	}()

	wg.Wait()
	close(staticResChan)
	close(mobileResChan)

	staticRes := <-staticResChan
	mobileRes := <-mobileResChan

	return staticRes, mobileRes, nil
}
