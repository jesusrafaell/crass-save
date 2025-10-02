package middleware

import (
	"github.com/labstack/echo/v4"
)

var langs = []string{"en", "es", "fr"}

func LangRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		lang := c.Request().Header.Get("lang")
		if lang == "" || !includes(langs, lang) {
			lang = "es"
		}
		c.Set("lang", lang)

		return next(c)
	}
}

func includes(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
