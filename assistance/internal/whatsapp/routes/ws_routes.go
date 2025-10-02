package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/handlers"

	"github.com/labstack/echo/v4"
)

func WhatsappHttp(e *echo.Echo, h handlers.WsHandler) {
	url := "/api/v1/assistance/ws"
	fmt.Println(url)
	wsGroup := e.Group(url)

	wsGroup.POST("/test", h.Test)
	wsGroup.POST("/marca", h.GetVehicleMakes)
	wsGroup.POST("/modelo", h.GetVehicleModelsByMake)
	wsGroup.GET("/types", h.GetVehicleTypes)
	wsGroup.POST("/marmode", h.GetVehicleMakeModel)

	wsGroup.GET("/user", h.GetWsUser)
	wsGroup.GET("/vehicle", h.GetWsVehicle)

	//assistance
	wsGroup.POST("/request", h.CreateAssistance)
	wsGroup.GET("/request", h.GetAssistanceByMobile)
	wsGroup.POST("/request/confirmed", h.ConfirmedRequest)
	wsGroup.POST("/request/cancel", h.CancelRequest)
	// wsGroup.POST("/requests/prices", h.GetOptionsRequest)
}
