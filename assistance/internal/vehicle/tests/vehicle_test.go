package test

import (
	"fmt"
	"log"
	"path/filepath"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/internal/db"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/suite"
)

type VehicleUsecaseSuite struct {
	suite.Suite
	db             *sqlx.DB
	vehicleRepo    repositories.VehicleRepository
	vehicleUsecase usecases.VehicleUsecase
	vehicleID      *uuid.UUID
}

func (suite *VehicleUsecaseSuite) SetupSuite() {
	envPath := filepath.Join("..", "..", "..", ".env")
	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Conectar a la base de datos de prueba
	suite.db, err = db.NewPostgres()
	if err != nil {
		log.Fatalf("Error connecting to db: %v\n", err)
	}

	// Inicializar repositorios y casos de uso
	makeRepo := repositories.NewMakeRepository(suite.db)
	modelRepo := repositories.NewModelRepository(suite.db)
	suite.vehicleRepo = repositories.NewVehicleRepository(suite.db)
	suite.vehicleUsecase = usecases.NewVehicleUsecaseImpl(suite.vehicleRepo, makeRepo, modelRepo, nil)
}

func (suite *VehicleUsecaseSuite) TearDownSuite() {
	// close conextion
	suite.db.Close()
}

func (suite *VehicleUsecaseSuite) TearDownTest() {
	// delete data test
	if suite.vehicleID != nil {
		fmt.Println("--------------", suite.vehicleID)
		_, err := suite.db.Exec("DELETE FROM a_vehicles WHERE id = $1", suite.vehicleID)
		if err != nil {
			log.Printf("Error cleaning up: %v", err)
		}
	}
}

func TestVehicleUsecaseSuite(t *testing.T) {
	suite.Run(t, new(VehicleUsecaseSuite))
}
