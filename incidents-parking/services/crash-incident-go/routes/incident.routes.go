package routes

import (
	"crashsaver/incident/handlers"

	"github.com/labstack/echo/v4"
)

func Incidents(e *echo.Echo, ih *handlers.IncidentsHandler) {
	//verify
	e.POST("/", ih.VerifyStaticIncident)

	//Get Nearby
	e.POST("/user", ih.GetNearbyIncidents)

	//static
	e.POST("/create", ih.CreateStatic)
	e.GET("/static/all", ih.GetStaticList)
	e.GET("/static/:id", ih.GetStaticById)
	e.PUT("/status/:id", ih.UpdateStatic)
	e.PUT("/icon/:id", ih.UpdateStatic)

	//mobile
	e.POST("/create/mobile", ih.CreateMobile)
	e.GET("/mobile/all", ih.GetMobileList)
	e.GET("/mobile/:id", ih.GetMobileById)
	e.PUT("/mobile/status/:id", ih.UpdateStatusMobile)

	e.GET("/all", ih.GetListIncidents)

	e.PUT("/mobile/location/:id", ih.UpdateLocationMobile)
}
