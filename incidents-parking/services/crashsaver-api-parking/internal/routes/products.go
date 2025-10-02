package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func Products(e *echo.Echo, ph *handlers.ProductsHandler) {
	group := e.Group("/products")
	group.GET("", ph.GetList)
	group.GET("/", ph.GetList)
	group.POST("/buy", ph.PaymentCredits)
}
