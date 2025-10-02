package routes

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

type Route struct {
	Name    string `mapstructure:"name"`
	Context string `mapstructure:"context"`
	Target  string `mapstructure:"target"`
	Version uint   `mapstructure:"version"`
}

func StartRoutes(e *echo.Echo, routes []Route) {
	for _, route := range routes {
		newRoute(e, route)
	}
}

func newRoute(e *echo.Echo, route Route) {
	proxy, err := NewProxy(route.Target)
	if err != nil {
		panic(err)
	}
	fmt.Printf("svc: %-18s | %-25s | %-1d | %-30s \n", route.Name, route.Context, route.Version, route.Target)
	e.Any(route.Context+"*", NewHandler(proxy, route.Version))
}
