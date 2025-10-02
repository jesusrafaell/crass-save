package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/color/handlers"

	"github.com/labstack/echo/v4"
)

func ColorRoutesHttp(e *echo.Echo, h handlers.ColorHandler) {
	url := "/api/v1/assistance/colors"
	fmt.Println(url)
	colorsGroup := e.Group(url)
	colorsGroup.GET("", h.GetList)
}
