package middleware

import (
	"strings"
)

var listPublicRoutes = []string{
	"/tpv/notification",
}

func isPublicRoute(path string) bool {
	for _, route := range listPublicRoutes {
			if strings.Contains(path, route) {
					return true
			}
	}
	return false
}