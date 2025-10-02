package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/insurance/handlers"

	"github.com/labstack/echo/v4"
)

func InsurancesHttp(e *echo.Echo, h handlers.InsuranceHandler) {
	url := "/api/v1/assistance/insurances"
	fmt.Println(url)
	insurancesGroup := e.Group(url)
	insurancesGroup.POST("", h.Create)
	insurancesGroup.GET("", h.GetList) //for country  o all
}
