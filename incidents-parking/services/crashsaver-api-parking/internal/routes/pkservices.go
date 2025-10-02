package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func PkServices(e *echo.Echo, psh *handlers.PkSVCHandler) {
	group := e.Group("/services")
	group.GET("", psh.GetALL)
	group.GET("/", psh.GetALL)
	group.GET("/parking/:parkingId", psh.GetByParkingID)
}
