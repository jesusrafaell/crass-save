package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Booking(e *echo.Echo, ph *handlers.BookingHandler) {
	group := e.Group("/booking")
	group.GET("/data", ph.GetList)
	group.GET("/drive", ph.GetListByDriveId) //header

	group.POST("", ph.Create)
	group.GET("/:id", ph.GetById)
	group.PUT("/:id", ph.Update)

	group.POST("/cancel", ph.Cancel)

	group.POST("/asignate", ph.Asignate) //confirme
}
