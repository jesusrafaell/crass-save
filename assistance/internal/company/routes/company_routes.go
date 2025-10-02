package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/company/handlers"

	"github.com/labstack/echo/v4"
)

func CompanyHttp(e *echo.Echo, h handlers.CompanyHandler) {
	url := "/api/v1/assistance/companies"
	fmt.Println(url)
	group := e.Group(url)
	group.GET("", h.GetList)
	group.GET("/info", h.GetListInfo)
	group.POST("", h.Create)
	group.PUT("/:id", h.Update)
}
