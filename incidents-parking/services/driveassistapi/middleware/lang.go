package middleware

import (
	"github.com/labstack/echo/v4"
)

func LangRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		lang := c.Request().Header.Get("lang")
		if lang == "" {
			lang = "es"
		}
		c.Set("lang", lang)

		return next(c)
	}
}
