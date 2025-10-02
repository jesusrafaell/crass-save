package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Status(e *echo.Echo, ph *handlers.StatusHandler) {
	group := e.Group("/status")
	group.GET("", ph.GetList)
	group.GET("/", ph.GetList)
}
