package handler

import (
	"github.com/labstack/echo/v4"
)

type VehicleHandler interface {
	GetVehiclesByUser(c echo.Context) error
	GetAll(c echo.Context) error
	GetById(c echo.Context) error
	Update(c echo.Context) error
	Delete(c echo.Context) error
	Create(c echo.Context) error
	CreateByUser(c echo.Context) error
}
