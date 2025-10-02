package handler

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	"github.com/labstack/echo/v4"
)

type MakeModelHandler interface {
	GetAllMakes(c echo.Context) error
	CreateModel(c echo.Context) error
	GetModelsByMake(c echo.Context) error
}

type makeModelHandler struct {
	vehicleMakeModelUsecase usecases.VehicleMakeModelUsecase
}

func NewMakeModelHandler(vehicleMakeModelUsecase usecases.VehicleMakeModelUsecase) MakeModelHandler {
	return &makeModelHandler{
		vehicleMakeModelUsecase,
	}
}

// makes
func (h *makeModelHandler) GetAllMakes(c echo.Context) error {
	res, err := h.vehicleMakeModelUsecase.GetMakes(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List Makes Vehicle", res)
}

// models
func (h *makeModelHandler) CreateModel(c echo.Context) error {
	req := new(models.CreateVehicleModel)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}
	_, err := h.vehicleMakeModelUsecase.CreateModel(c.Request().Context(), req)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Created(c)
}

func (h *makeModelHandler) GetModelsByMake(c echo.Context) error {
	makeId := c.QueryParam("makeId")
	if makeId == "" {
		return responses.InternalServerError(c, "invalid make")
	}
	models, err := h.vehicleMakeModelUsecase.GetModelsByMakeID(c.Request().Context(), makeId)
	if err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	return responses.Success(c, "List models by make", models)
}
