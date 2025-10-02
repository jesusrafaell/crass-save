package middleware

import (
	"net/http"
	"strings"

	"api/gateway/pkg/authorization"

	"github.com/labstack/echo/v4"
)

// ErrorResponse estructura para manejar respuestas de error
type ErrorReponse struct {
	Error string `json:"error"`
	Name  string `json:"name"`
	Ok    bool   `json:"ok"`
}

// errBearerToken representa un error de token Bearer faltante o incorrecto
var ErrBearerToken = &ErrorReponse{
	Error: "R018E",
	Name:  "Need Bearer token",
	Ok:    false,
}

// GetBearerToken obtiene el token Bearer del encabezado de la solicitud
func GetBearerToken(c echo.Context) (string, *ErrorReponse) {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return "", ErrBearerToken
	}

	// Divide el encabezado Authorization en partes
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", ErrBearerToken
	}

	token := parts[1] // 0 = Bearer, 1 = token

	return token, nil
}

// AuthMiddleware middleware para manejar autenticación y autorización
func AuthMiddleware(auth *authorization.Authorization) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			c.Set("userId", "")
			c.Set("roleKey", "")
			c.Set("companyKey", "")
			c.Set("os", "")

			if isPublicRoute(c.Request().URL.Path) {
				return next(c)
			}

			token, errToken := GetBearerToken(c)
			if errToken != nil {
				return c.JSON(http.StatusUnauthorized, errToken)
			}

			c.Set("token", token)

			ignoreSession := true
			if strings.Contains(c.Request().URL.Path, validRoute) {
				ignoreSession = false
			}

			claims, errAuth := auth.VerifySession(token, ignoreSession)
			if errAuth != nil {
				return c.JSON(http.StatusUnauthorized, &ErrorReponse{
					Error: errAuth.Code,
					Name:  errAuth.Name,
					Ok:    false,
				})
			}

			c.Set("userId", claims.UserID)
			c.Set("roleKey", claims.RoleKey)
			c.Set("companyKey", claims.CompanyKey)
			c.Set("os", claims.OS)
			return next(c)
		}
	}
}
