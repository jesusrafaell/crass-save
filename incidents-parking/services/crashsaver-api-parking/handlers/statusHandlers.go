package handlers

import (
	"crashsaver/parking/internal/services"

	"github.com/labstack/echo/v4"
)

type StatusHandler struct {
	service services.StatusService
}

func NewsStatusHandler(service services.StatusService) *StatusHandler {
	return &StatusHandler{service}
}

func (sh *StatusHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	status, err := sh.service.GetList(lang)
	if err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	return ResponseSuccess(c, "List status", status)
}
