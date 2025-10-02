package middleware

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type responseRecorder struct {
	http.ResponseWriter
	Body *bytes.Buffer
}

func newResponseRecorder() *responseRecorder {
	return &responseRecorder{
		Body: new(bytes.Buffer),
	}
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	r.Body.Write(b)
	return r.ResponseWriter.Write(b)
}

func LogRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		startTime := time.Now()

		// Create custom response
		recorder := newResponseRecorder()
		recorder.ResponseWriter = c.Response().Writer
		c.Response().Writer = recorder

		// Process
		err := next(c)

		// extract
		var responseError map[string]interface{}
		if recorder.Body.Len() > 0 {
			json.Unmarshal(recorder.Body.Bytes(), &responseError)
		}

		log.Printf("Request: %s %s, Status: %d, Took: %v, Error: %v", c.Request().Method, c.Request().URL, c.Response().Status, time.Since(startTime), responseError["error"])

		return err
	}
}
