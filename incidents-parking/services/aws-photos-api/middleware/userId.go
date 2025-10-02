package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func UserIdRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userId := c.Request().Header.Get("x-user-id")
		if userId == "" {
			// Si X-User-Id no tiene datos, responder con un error
			return echo.NewHTTPError(http.StatusUnauthorized, "H-User invalid")
		}
		c.Set("userId", userId)

		return next(c)
	}
}
