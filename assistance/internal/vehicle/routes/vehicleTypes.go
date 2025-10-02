package routes

import (
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/handler"
	"fmt"

	"github.com/labstack/echo/v4"
)

func VehicleTypes(e *echo.Echo, h handler.VehicleTypesHandler) {
	url := "/api/v1/assistance/types"
	fmt.Println(url)
	typesGroup := e.Group(url)

	typesGroup.GET("", h.GetAll)
}
