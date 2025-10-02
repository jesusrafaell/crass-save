package handler

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	"github.com/labstack/echo/v4"
)

type VehicleTypesHandler interface {
	GetAll(c echo.Context) error
}

type vehicleTypesHandler struct {
	vehicleTypesUsecase usecases.VehicleTypeUsecase
}

func NewTypesHandler(vehicleTypesUsecase usecases.VehicleTypeUsecase) VehicleTypesHandler {
	return &vehicleTypesHandler{
		vehicleTypesUsecase,
	}
}

func (h *vehicleTypesHandler) GetAll(c echo.Context) error {
	res, err := h.vehicleTypesUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List types", res)
}
