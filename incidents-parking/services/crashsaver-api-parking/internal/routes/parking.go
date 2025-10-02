package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Parking(e *echo.Echo, ph *handlers.ParkingHandler) {
	group := e.Group("/parking")
	group.GET("/all", ph.GetList)
	group.GET("/:id", ph.GetById)
	//create
	group.POST("", ph.Create)
}
