package routes

import (
	"api/driveassist/handlers"

	"github.com/labstack/echo/v4"
)

func TypesMachine(e *echo.Echo, tmh *handlers.TypesMachineHandler) {
	typesMachineGroup := e.Group("/typesmachine")
	typesMachineGroup.GET("", tmh.GetList)
}

func Insurances(e *echo.Echo, ih *handlers.InsuranceHandler) {
	insurancesGroup := e.Group("/insurances")
	// crud
	insurancesGroup.POST("", ih.Create)
	insurancesGroup.GET("", ih.GetList) //for country  o all
}

func Countries(e *echo.Echo, ch *handlers.CountryHandler) {
	countriesGroup := e.Group("/countries")
	countriesGroup.GET("", ch.GetList)
}

func Color(e *echo.Echo, vh *handlers.ColorHandler) {
	colorsGroup := e.Group("/colors")
	colorsGroup.GET("", vh.GetList)
}

func DriveTrainTypes(e *echo.Echo, vh *handlers.DriveTrainTypeHandler) {
	driveTraintypesGroup := e.Group("/drivetraintypes")
	driveTraintypesGroup.GET("", vh.GetList)
}

func Weights(e *echo.Echo, vh *handlers.WeightsHandler) {
	weightsGroup := e.Group("/weights")
	weightsGroup.GET("", vh.GetList)
}
