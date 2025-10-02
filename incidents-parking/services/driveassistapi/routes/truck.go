package routes

import (
	"api/driveassist/handlers"

	"github.com/labstack/echo/v4"
)

func Truck(e *echo.Echo, vh *handlers.TowTruckHandler) {
	//base
	truckGroup := e.Group("/towtruck")
	truckGroup.POST("", vh.CreateByUser)
	truckGroup.GET("", vh.GetListByUser)
	truckGroup.GET("/all", vh.GetList)
	truckGroup.PUT("/:id", vh.Update)
	truckGroup.DELETE("/:id", vh.Delete)
	// truckGroup.POST("/new", vh.Create)
}

func CraneTypes(e *echo.Echo, vh *handlers.CraneTypesHandler) {
	craneTypesGroup := e.Group("/cranetypes")
	craneTypesGroup.GET("", vh.GetList)
}

func MakesTowTruck(e *echo.Echo, bh *handlers.MakeTowTruckHandler) {
	makesGroup := e.Group("/towtruck/makes")
	makesGroup.GET("", bh.GetList)
}
