package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/assistance/handlers"

	"github.com/labstack/echo/v4"
)

func AssistanceHttp(e *echo.Echo, h handlers.AssistanceHandler) {
	url := "/api/v1/assistance/requests"
	fmt.Println(url)
	assistanceGroup := e.Group(url)

	// assistanceGroup.GET("/all", h.GetList)
	assistanceGroup.GET("", h.GetList)
	assistanceGroup.GET("/filter", h.GetFilter)
	assistanceGroup.GET("/:id", h.GetById)

	//mobile user
	// assistanceGroup.POST("/drivers", h.FindOptionsDrivers)
	assistanceGroup.POST("", h.CreateByUser)
	assistanceGroup.POST("/cancel", h.Cancel)
	assistanceGroup.GET("/user", h.GetByUser)
	assistanceGroup.PUT("/user/completed", h.ConfirmedCompletedUser)

	//mobile driver
	assistanceGroup.GET("/driver", h.GetByDriver)
	assistanceGroup.GET("/driver/pending", h.GetDriverPending)
	assistanceGroup.POST("/driver/confirmed", h.DriverConfirmed)
	assistanceGroup.PUT("/driver/completed", h.ConfirmedCompletedDriver)
	assistanceGroup.PUT("/driver/status", h.ChangeStatus)

	//company (web)
	assistanceGroup.GET("/company/dashboard-data/:id", h.GetDashboardByCompanyId)
	assistanceGroup.GET("/company/:id", h.GetListByCompanyId)
}
