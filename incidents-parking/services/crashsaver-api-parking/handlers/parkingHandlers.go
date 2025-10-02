package handlers

import (
	"crashsaver/parking/internal/services"
	"crashsaver/parking/types"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ParkingHandler struct {
	service services.ParkingService
}

func NewParkingHandler(service services.ParkingService) *ParkingHandler {
	return &ParkingHandler{
		service,
	}
}

func (ph *ParkingHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	all := false
	if a := c.QueryParam("all"); a != "" {
		all = true
	}
	res, err := ph.service.ListParking(lang, all)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "list companies", res)
}

func (ph *ParkingHandler) GetById(c echo.Context) error {
	lang := c.Get("lang").(string)
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}
	res, err := ph.service.GetById(lang, id)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "parking data", res)
}

func (ph *ParkingHandler) Create(c echo.Context) error {
	var req types.CreateParking

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := ph.service.Create(req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseCreated(c)
}
