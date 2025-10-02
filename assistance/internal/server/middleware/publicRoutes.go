package middleware

import (
	"strings"
)

var listPublicRoutes = []string{
	"/assistance/ws",
	"/assistance/makes",
	"/assistance/color",
	"/assistance/models",
	"/assistance/weights",
	"/assistance/types",
	"/assistance/drive-train-types",
	"/assistance/engine-type",
	"/assistance/insurances",
	"/assistance/countries",
}

func isPublicRoute(path string) bool {
	for _, route := range listPublicRoutes {
		if strings.Contains(path, route) {
			return true
		}
	}
	return false
}
