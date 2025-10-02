package routes

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/handler"
	"fmt"

	"github.com/labstack/echo/v4"
)

func TowTruckTypes(e *echo.Echo, h handler.TowTruckTypesHandler) {
	url := "/api/v1/assistance/crane-types"
	fmt.Println(url)
	craneTypesGroup := e.Group(url)

	craneTypesGroup.POST("", h.Create)
	craneTypesGroup.PUT("/:id", h.Update)

	craneTypesGroup.GET("", h.GetList)
	craneTypesGroup.GET("/data", h.GetListData)
}
