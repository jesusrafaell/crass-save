package handlers

import (
	"crashsaver/parking/internal/services"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type PkSVCHandler struct {
	service services.PkSVCService
}

func NewPkSVCHandler(service services.PkSVCService) *PkSVCHandler {
	return &PkSVCHandler{service}
}

func (ph *PkSVCHandler) GetALL(c echo.Context) error {
	lang := c.Get("lang").(string)
	res, err := ph.service.GetAll(lang)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "services", res)
}

func (ph *PkSVCHandler) GetByParkingID(c echo.Context) error {
	lang := c.Get("lang").(string)
	idStr := c.Param("parkingId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}
	res, err := ph.service.GetByParkingID(lang, id)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "services parking", res)
}
