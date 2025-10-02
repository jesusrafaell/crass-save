package routes

import (
	"crashsaver/parking/handlers"

	"github.com/labstack/echo/v4"
)

func LicensePlateXCompany(e *echo.Echo, lxch *handlers.LicensePlateXCompanyHandler) {
	group := e.Group("/company/licenseplate")
	group.POST("", lxch.Create)
	group.GET("/:companyId", lxch.ListByCompanyId)
}
