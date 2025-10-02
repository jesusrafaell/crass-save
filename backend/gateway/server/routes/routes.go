package router

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func Routes(e *echo.Echo, routes []Route) {
	fmt.Printf("Routes:\n")
	for _, route := range routes {
		newRoute(e, route)
	}
	fmt.Printf("---------------Ready---------------\n")
}

func newRoute(e *echo.Echo, route Route) {
	for _, c := range route.Contexts {
		fmt.Printf("%-12s | %-20s | %s \n", c.Name, c.Context, route.Target)
		e.Any(c.Context+"*", NewProxyHandler(route.Target))
	}
}
