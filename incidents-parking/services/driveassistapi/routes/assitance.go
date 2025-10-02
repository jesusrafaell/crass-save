package routes

import (
	"api/driveassist/handlers"

	"github.com/labstack/echo/v4"
)

func AssistanceRequest(e *echo.Echo, arh *handlers.AssistanceRequestHandler) {
	assistanceGroup := e.Group("/assistance")
	assistanceGroup.GET("/all", arh.GetList)
	assistanceGroup.POST("", arh.CreateByUser)
	assistanceGroup.GET("/user", arh.GetByUser)
	assistanceGroup.POST("/cancel", arh.Cancel)
}
