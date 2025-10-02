package country

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func Routes(e *echo.Echo, h CountryHandler) {
	url := "/api/v1/assistance/countries"
	fmt.Println(url)
	countriesGroup := e.Group(url)
	countriesGroup.GET("", h.GetList)
}
