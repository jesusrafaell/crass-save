package middleware

import (
	"strings"
)

var listPublicRoutes = []string{
	"/login",
	"/auth/register",
	"/auth/verify",
	"/auth/forgot-password",
	"/verify-token/",
	"/v1/api/public",
	"/version/mobile",
	"parking/tpv/notification",
}

func isPublicRoute(path string) bool {
	for _, route := range listPublicRoutes {
		if strings.Contains(path, route) {
			return true
		}
	}
	return false
}
