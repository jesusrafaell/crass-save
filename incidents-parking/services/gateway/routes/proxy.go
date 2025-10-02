package routes

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/labstack/echo/v4"
)

func NewProxy(targetURL string) (*httputil.ReverseProxy, error) {
	target, err := url.Parse(targetURL)
	if err != nil {
		return nil, err
	}
	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.ModifyResponse = func(response *http.Response) error {
		req := response.Request
		log.Printf("Proxy Request: %s %s, Status: %d", req.Method, req.URL, response.StatusCode)
		return nil
	}
	return proxy, nil
}

func NewHandler(p *httputil.ReverseProxy, version uint) echo.HandlerFunc {
	return func(c echo.Context) error {
		// c.Logger().Printf("URL de solicitud: %s", targetPath)
		req := c.Request()
		targetPath := c.Param("*")

		if version == 0 {
			targetPath = strings.TrimPrefix(req.URL.Path, "/v1/api")
		}

		req.URL.Path = targetPath

		//user
		if userId, ok := c.Get("userId").(string); ok {
			req.Header.Set("x-user-id", userId)
		}
		if userRole, ok := c.Get("userRole").(string); ok {
			req.Header.Set("x-role", userRole)
		}

		// Serve Rroxy
		p.ServeHTTP(c.Response().Writer, req)

		return nil
	}
}
