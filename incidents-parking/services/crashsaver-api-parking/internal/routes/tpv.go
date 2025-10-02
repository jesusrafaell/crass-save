package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Tpv(e *echo.Echo, sh *handlers.TpvHandler) {
	groupTpv := e.Group("/tpv")
	groupTpv.POST("/pay", sh.Payment)
	groupTpv.POST("/notification", sh.Notification)
}
