package test

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func (suite *VehicleUsecaseSuite) TestVehicleUsecase_Create() {
	//Data Test
	insuranceID := uuid.MustParse("1c67a8f2-3bb6-4ca0-a4ed-7515c675c4f2")
	addVehicle := models.AddVehicle{
		Year:             2010,
		LicensePlate:     "TEST01",
		ImagePath:        "https://files-myappssistance.s3.us-east-1.amazonaws.com/files/15e5ee71-89b8-11ef-bc7d-00155dbf0111/1728862965.jpg",
		UserID:           uuid.MustParse("d24f58f0-7f44-472f-819e-abed4b5e6fa5"),
		ColorID:          uuid.MustParse("a7c127c4-0c9c-461d-8fbe-684307a8e259"),
		ModelID:          uuid.MustParse("32e5d602-17b7-48fa-a112-994df9490f41"),
		TypeID:           uuid.MustParse("8c6cc4e7-6826-4ab2-8d9d-4695f11d1b47"),
		DriveTrainTypeID: uuid.MustParse("29013e99-2a7b-4d03-b301-f38158531399"),
		WeightID:         uuid.MustParse("76cea60c-b998-4149-bed7-baa14b998a2d"),
		EngineTypeID:     uuid.MustParse("4b9bd457-c210-481d-b52f-2ae3f423c642"),
		CountryID:        uuid.MustParse("5add93f9-2d4a-4bc8-a37d-b7a413638530"),
		InsuranceID:      &insuranceID,
	}

	// Ejecución del caso de uso
	vehicle, errapi := suite.vehicleUsecase.Create(context.Background(), &addVehicle)
	assert.NoError(suite.T(), errapi.ErrorGo())
	assert.NotNil(suite.T(), vehicle.ID)
	suite.vehicleID = &vehicle.ID
}
