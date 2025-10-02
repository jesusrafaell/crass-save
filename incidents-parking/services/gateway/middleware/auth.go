package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	pb "api/gateway/proto"
	"api/gateway/services"

	"github.com/labstack/echo/v4"
)

func GetBearerToken(c echo.Context) (string, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("R018E")
	}

	// Divide el encabezado Authorization en partes
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", fmt.Errorf("R018E")
	}

	token := parts[1] //0 = bearer, 1 = token

	return token, nil
}

type ErrorReponse struct {
	Error string `json:"error"`
	Name  string `json:"name"`
	Ok    bool   `json:"ok"`
}

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Set("userId", "")
		c.Set("userRole", "")
		if isPublicRoute(c.Request().URL.Path) {
			return next(c)
		}

		token, err := GetBearerToken(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, &ErrorReponse{
				Error: err.Error(), //err.Error()
				Name:  "Error",
				Ok:    false,
			})
		}

		c.Set("token", token)

		//v2
		services.InitGRPCConnection()
		if services.ConnErr != nil {
			return c.JSON(http.StatusUnauthorized, &ErrorReponse{
				Error: "R018E", //err.Error(),
				Name:  "No connect to AUTH Server",
				Ok:    false,
			})
		}

		client := pb.NewAuthServiceClient(services.Conn)

		ctx, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()

		//if session else verify
		var r *pb.TokenResponse
		r, err = client.Session(ctx, &pb.TokenRequest{Token: token})
		if err != nil {
			return c.JSON(http.StatusUnauthorized, &ErrorReponse{
				Error: "R018E", //err.Error(),
				Name:  err.Error(),
				Ok:    false,
			})
		}

		codeError := r.GetCodeError()
		userId := r.GetUserId()
		userRole := r.GetRole()

		if codeError == 0 && userId != "" && userRole != "" {
			c.Set("userId", r.GetUserId())
			c.Set("userRole", r.GetRole())

			return next(c)
		}

		if codeError != 0 && r.GetMsgError() != "" {
			log.Println("Error (AUTH):", codeError, r.MsgError)
			if codeError == 400 {
				return c.JSON(http.StatusBadRequest, &ErrorReponse{
					Error: r.GetMsgError(),
					Name:  "Error (Auth)",
					Ok:    false,
				})
			} else if codeError == 401 {
				return c.JSON(http.StatusUnauthorized, &ErrorReponse{
					Error: r.GetMsgError(),
					Name:  "Error (Auth)",
					Ok:    false,
				})
			} else if codeError == 502 {
				return c.JSON(http.StatusBadGateway, &ErrorReponse{
					Error: r.GetMsgError(),
					Name:  "Error (Auth)",
					Ok:    false,
				})
			}
		}
		return c.JSON(http.StatusBadGateway, &ErrorReponse{
			Error: "R018E",
			Name:  "Unauthorized",
			Ok:    false,
		})
	}
}
