package handlers

import (
	"github.com/labstack/echo/v4"
)

type AssistanceHandler interface {
	GetList(c echo.Context) error
	GetById(c echo.Context) error
	CreateByUser(c echo.Context) error
	GetByUser(c echo.Context) error
	GetByDriver(c echo.Context) error
	GetDriverPending(c echo.Context) error
	Cancel(c echo.Context) error
	DriverConfirmed(c echo.Context) error
	ChangeStatus(c echo.Context) error
	ConfirmedCompletedUser(c echo.Context) error
	ConfirmedCompletedDriver(c echo.Context) error
	GetFilter(c echo.Context) error
	GetDashboardByCompanyId(c echo.Context) error
	GetListByCompanyId(c echo.Context) error
	// FindOptionsDrivers(c echo.Context) error
}
