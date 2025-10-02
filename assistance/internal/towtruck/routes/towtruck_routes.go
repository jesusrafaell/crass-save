package routes

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/handler"
	"fmt"

	"github.com/labstack/echo/v4"
)

func TowTrucks(e *echo.Echo, h handler.TowTruckHandler) {
	url := "/api/v1/assistance/tow-truck"
	fmt.Println(url)
	//base
	truckGroup := e.Group(url)
	truckGroup.POST("", h.CreateByUser)
	truckGroup.GET("", h.GetListByUser)

	truckGroup.GET("/all", h.GetList)
	truckGroup.PUT("/:id", h.Update)
	truckGroup.DELETE("/:id", h.Delete)
	//
	truckGroup.POST("/:id", h.Activate)

	//web
	truckGroup.POST("/company", h.CreateByCompany)
	truckGroup.GET("/all/company/:id", h.GetListByCompany)
	truckGroup.POST("/assign-driver", h.UpdateDriver)

	//register gasoline TTid
	truckGroup.POST("/expense-history", h.AddExpenseTT)
	truckGroup.GET("/expense-history/:id", h.GetHistoryExpenseByTTId)

	truckGroup.GET("/expense-history/company/:id", h.GetHistoryByCompany)
}
