package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/weight/handlers"

	"github.com/labstack/echo/v4"
)

func WeightsHttp(e *echo.Echo, h handlers.WeightsHandler) {
	url := "/api/v1/assistance/weights"
	fmt.Println(url)
	weightsGroup := e.Group(url)
	weightsGroup.GET("", h.GetList)
}
