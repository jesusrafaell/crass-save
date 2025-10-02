package middleware

import (
	"log"
	"time"

	"github.com/labstack/echo/v4"
)

func LogMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		startTime := time.Now()

		err := next(c)

		duration := time.Since(startTime)

		log.Printf("Request: %s %s, Status: %d, Took: %v", c.Request().Method, c.Request().URL, c.Response().Status, duration)

		return err
	}
}
