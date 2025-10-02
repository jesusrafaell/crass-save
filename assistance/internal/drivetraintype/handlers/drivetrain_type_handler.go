package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type DriveTrainTypeHandler interface {
	GetList(c echo.Context) error
}

type driveTrainTypeHandler struct {
	driveTrainTypeUsecase usecases.DriveTrainTypeUsecase
}

func NewDriveTrainTypeHandler(driveTrainTypeUsecase usecases.DriveTrainTypeUsecase) DriveTrainTypeHandler {
	return &driveTrainTypeHandler{
		driveTrainTypeUsecase: driveTrainTypeUsecase,
	}
}

func (h *driveTrainTypeHandler) GetList(c echo.Context) error {
	driveTrainTypes, err := h.driveTrainTypeUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Drive Train Types", driveTrainTypes)
}
