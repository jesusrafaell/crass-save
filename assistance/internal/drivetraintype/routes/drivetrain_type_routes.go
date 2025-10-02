package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/handlers"

	"github.com/labstack/echo/v4"
)

func DriveTrainTypesHttp(e *echo.Echo, h handlers.DriveTrainTypeHandler) {
	url := "/api/v1/assistance/drive-train-types"
	fmt.Println(url)
	driveTraintypesGroup := e.Group(url)
	driveTraintypesGroup.GET("", h.GetList)
}
