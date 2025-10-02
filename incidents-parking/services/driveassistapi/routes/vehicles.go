package routes

import (
	"api/driveassist/handlers"

	"github.com/labstack/echo/v4"
)

func Vehicles(e *echo.Echo, vh *handlers.VehicleHandler) {
	//base
	vehiclesGroup := e.Group("/vehicles")
	vehiclesGroup.GET("", vh.GetListByUser)
	vehiclesGroup.GET("/all", vh.GetList)
	vehiclesGroup.POST("", vh.CreateByUser)
	vehiclesGroup.POST("/new", vh.Create)
	vehiclesGroup.PUT("/:id", vh.Update)
	vehiclesGroup.DELETE("/:id", vh.Delete)
}

func Types(e *echo.Echo, vh *handlers.TypesHandler) {
	typesGroup := e.Group("/types")
	typesGroup.GET("", vh.GetList)
}

func Brands(e *echo.Echo, bh *handlers.BrandHandler) {
	brandsGroup := e.Group("/brands")
	brandsGroup.GET("", bh.GetList)
}

func Models(e *echo.Echo, mh *handlers.ModelHandler) {
	modelGroup := e.Group("/models")
	modelGroup.GET("", mh.GetList)
	modelGroup.POST("", mh.Create) //create brand and model
}
