package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/handlers"

	"github.com/labstack/echo/v4"
)

func EngineTypesHttp(e *echo.Echo, h handlers.EngineTypeHandler) {
	url := "/api/v1/assistance/engine-type"
	fmt.Println(url)
	group := e.Group(url)
	group.GET("", h.HandleGetAll)
}
