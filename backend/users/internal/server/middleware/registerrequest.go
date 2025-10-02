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
	Body   *bytes.Buffer
	Status int
}

func newResponseRecorder(w http.ResponseWriter) *responseRecorder {
	return &responseRecorder{
		ResponseWriter: w,
		Body:           new(bytes.Buffer),
		Status:         http.StatusOK, // Default status
	}
}

func (r *responseRecorder) WriteHeader(statusCode int) {
	r.Status = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	r.Body.Write(b)
	return r.ResponseWriter.Write(b)
}

func RegisterRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		startTime := time.Now()

		// Create custom response
		recorder := newResponseRecorder(c.Response().Writer)
		c.Response().Writer = recorder

		// Process
		err := next(c)

		// extract
		var responseError map[string]interface{}
		if recorder.Body.Len() > 0 {
			json.Unmarshal(recorder.Body.Bytes(), &responseError)
		}

		// Log the details of the request and response
		log.Printf(
			"Request: %s %s, Status: %d, Took: %v, Error: %v",
			c.Request().Method,
			c.Request().URL,
			recorder.Status, // Now this will show the correct status code
			time.Since(startTime),
			responseError["error"],
		)

		return err
	}
}
