package middleware

import (
	"github.com/labstack/echo/v4"
)

func UserIdRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// if isPublicRoute(c.Request().URL.Path) {
		// 	return next(c)
		// }
		userId := c.Request().Header.Get("x-user-id")
		roleKey := c.Request().Header.Get("x-role-key")
		companyKey := c.Request().Header.Get("x-company-key")
		os := c.Request().Header.Get("x-os")
		// if userId == "" {
		// 	return echo.NewHTTPError(http.StatusUnauthorized, "data userId not found")
		// }
		c.Set("userId", userId)
		c.Set("roleKey", roleKey)
		c.Set("companyKey", companyKey)
		c.Set("os", os)

		// log.Println("Midd= userId:", userId, " / roleKey:", roleKey, " / companyKey:", companyKey)

		return next(c)
	}
}
