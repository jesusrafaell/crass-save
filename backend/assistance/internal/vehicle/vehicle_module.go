package vehicle

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/handler"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type VehiclesModule struct {
	VehiclesRepository     repositories.VehicleRepository
	VehicleTypeRepository  repositories.TypeRepository
	VehicleMakeRepository  repositories.MakeRepository
	VehicleModelRepository repositories.ModelRepository
}

func NewModule(db *sqlx.DB) *VehiclesModule {
	vehicleTypeRepository := repositories.NewTypeRepository(db)
	vehicleMakeRepository := repositories.NewMakeRepository(db)
	vehicleModelRepository := repositories.NewModelRepository(db)
	vehicleRepository := repositories.NewVehicleRepository(db)

	return &VehiclesModule{
		VehiclesRepository:     vehicleRepository,
		VehicleTypeRepository:  vehicleTypeRepository,
		VehicleMakeRepository:  vehicleMakeRepository,
		VehicleModelRepository: vehicleModelRepository,
	}
}

func (m *VehiclesModule) Routes(e *echo.Echo, insuranceRepo insuranceRepository.InsuranceRepository) {
	fmt.Printf("Vehicles Routes:\n")

	vehicleTypeUsecase := usecases.NewVehicleTypeUsecaseImpl(m.VehicleTypeRepository)
	vehicleMakeModelUsecase := usecases.NewMakeModelUsecaseImpl(m.VehicleMakeRepository, m.VehicleModelRepository)
	vehicleUsecase := usecases.NewVehicleUsecaseImpl(m.VehiclesRepository, m.VehicleMakeRepository, m.VehicleModelRepository, insuranceRepo)

	routes.VehicleTypes(e, handler.NewTypesHandler(vehicleTypeUsecase))
	routes.VehicleMakeModel(e, handler.NewMakeModelHandler(vehicleMakeModelUsecase))
	routes.Vehicles(e, handler.NewVehicleHandler(vehicleUsecase))

	fmt.Printf("--\n")
}
