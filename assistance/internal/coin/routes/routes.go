package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/coin/handlers"
	"github.com/labstack/echo/v4"
)

func CoinHttp(e *echo.Echo, h handlers.CoinHandler) {
	url := "/api/v1/assistance/coins"
	fmt.Println(url)
	group := e.Group(url)
	group.GET("", h.GetList)
}
