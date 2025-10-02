package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Company(e *echo.Echo, ch *handlers.CompanyHandler) {
	group := e.Group("/company")
	group.GET("/all", ch.GetList)
	group.GET("/:id", ch.GetByID)
	group.POST("", ch.Create)
}
