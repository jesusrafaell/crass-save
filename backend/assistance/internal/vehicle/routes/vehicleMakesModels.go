package routes

import (
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/handler"
	"fmt"

	"github.com/labstack/echo/v4"
)

func VehicleMakeModel(e *echo.Echo, h handler.MakeModelHandler) {
	urlMake := "/api/v1/assistance/makes"
	fmt.Println(urlMake)
	makesGroup := e.Group(urlMake)
	makesGroup.GET("", h.GetAllMakes)

	urlModel := "/api/v1/assistance/models"
	fmt.Println(urlModel)
	modelGroup := e.Group(urlModel)
	modelGroup.GET("", h.GetModelsByMake)
	modelGroup.POST("", h.CreateModel)
}
