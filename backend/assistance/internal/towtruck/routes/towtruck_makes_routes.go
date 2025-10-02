package routes

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/handler"

	"github.com/labstack/echo/v4"
)

func TowTruckMakes(e *echo.Echo, h handler.TowTruckMakeHandler) {
	url := "/api/v1/assistance/tow-truck/makes"
	println(url)

	makesGroup := e.Group(url)
	makesGroup.POST("", h.Create)
	makesGroup.PUT("/:id", h.Update)
	makesGroup.GET("", h.GetAll)

	// makesGroup.GET("/data", h.GetListData)
}
