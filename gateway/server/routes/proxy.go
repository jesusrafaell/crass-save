package router

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

func NewProxyHandler(targetURL string) echo.HandlerFunc {
	return func(c echo.Context) error {
		req := c.Request()
		url := targetURL + req.URL.String()
		newReq, err := http.NewRequest(req.Method, url, req.Body)
		if err != nil {
			return err
		}

		for key, values := range req.Header {
			for _, value := range values {
				newReq.Header.Add(key, value)
			}
		}

		// Agregar headers adicionales si es necesario
		if userId, ok := c.Get("userId").(string); ok {
			newReq.Header.Set("x-user-id", userId)
		}
		if roleKey, ok := c.Get("roleKey").(string); ok {
			newReq.Header.Set("x-role-key", roleKey)
		}
		if companyKey, ok := c.Get("companyKey").(string); ok {
			newReq.Header.Set("x-company-key", companyKey)
		}
		if os, ok := c.Get("os").(string); ok {
			newReq.Header.Set("x-os", os)
		}

		// Enviar la solicitud al backend
		client := &http.Client{}
		resp, err := client.Do(newReq)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		// Copiar los headers de la respuesta
		for key, values := range resp.Header {
			for _, value := range values {
				c.Response().Header().Add(key, value)
			}
		}

		// Escribir el código de estado
		c.Response().WriteHeader(resp.StatusCode)

		// Copiar el cuerpo de la respuesta
		_, err = io.Copy(c.Response().Writer, resp.Body)
		return err
	}
}
