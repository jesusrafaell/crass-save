package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/handlers"

	"github.com/labstack/echo/v4"
)

func RatePricesHttp(e *echo.Echo, h handlers.RatePriceHandler) {
	url := "/api/v1/assistance/rate-prices"
	fmt.Println(url)

	group := e.Group(url)
	group.GET("", h.GetList)
	group.GET("/types", h.GetTypesRatePrice)

	group.POST("/type&meters", h.GetPriceXKm)

	group.PUT("/:id", h.Update)

	// group.POST("", h.Create)
	// group.DELETE("/:id", h.Update)
}
