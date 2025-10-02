package drivetraintype

import (
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type DriveTrainTypesModule struct {
	Repository repositories.DriveTrainTypeRepository
	Usecase    usecases.DriveTrainTypeUsecase
	Handler    *handlers.DriveTrainTypeHandler
}

func NewDriveTrainTypesModule(db *sqlx.DB) *DriveTrainTypesModule {
	driveTrainTypeRepository := repositories.NewDriveTrainTypeRepository(db)
	driveTrainTypeUsecase := usecases.NewDriveTrainTypeUsecaseImpl(driveTrainTypeRepository)
	driveTrainHandler := handlers.NewDriveTrainTypeHandler(driveTrainTypeUsecase)
	return &DriveTrainTypesModule{
		Repository: driveTrainTypeRepository,
		Usecase:    driveTrainTypeUsecase,
		Handler:    &driveTrainHandler,
	}
}

func (m *DriveTrainTypesModule) Routes(e *echo.Echo) {
	routes.DriveTrainTypesHttp(e, *m.Handler)
}
