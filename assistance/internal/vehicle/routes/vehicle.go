package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/handler"

	"github.com/labstack/echo/v4"
)

func Vehicles(e *echo.Echo, h handler.VehicleHandler) {
	url := "/api/v1/assistance/vehicles"
	fmt.Println(url)

	vehiclesGroup := e.Group(url)

	// v2 sql
	vehiclesGroup.GET("/:id", h.GetById)
	vehiclesGroup.GET("", h.GetVehiclesByUser)
	vehiclesGroup.GET("/all", h.GetAll)

	//create
	vehiclesGroup.POST("", h.CreateByUser)
	vehiclesGroup.POST("/new", h.Create)

	vehiclesGroup.PUT("/:id", h.Update)
	vehiclesGroup.DELETE("/:id", h.Delete)
}
