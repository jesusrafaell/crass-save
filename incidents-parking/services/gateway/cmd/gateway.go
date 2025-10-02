package cmd

import (
	midd "api/gateway/middleware"
	"api/gateway/routes"
	"api/gateway/services"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Gateway struct {
	routes []routes.Route
	port   string
	eNV    string
}

func NewGateway(env string, port string) *Gateway {
	routes, err := routes.GatewayRoutes(env)
	if err != nil {
		log.Fatalf("List Routes %v", err)
	}
	return &Gateway{
		routes,
		port,
		env,
	}
}

func (g *Gateway) RunGateway() {
	e := echo.New()
	e.HideBanner = true

	g.configureMiddleware(e)
	g.initGRPCConnections()
	g.defineRoutes(e)

	e.Logger.Fatal(e.Start(":" + g.port))
}

func (g *Gateway) configureMiddleware(e *echo.Echo) {
	headers := []string{
		echo.HeaderOrigin, echo.HeaderContentType,
		echo.HeaderAccept, echo.HeaderAuthorization,
		echo.HeaderContentLength, echo.HeaderAcceptEncoding,
		echo.HeaderAccessControlAllowOrigin, echo.HeaderAccessControlAllowHeaders,
		echo.HeaderContentDisposition,
		"Authorization", "lang", "x-user-Id", "x-role",
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:  []string{"*"},
		AllowHeaders:  headers,
		ExposeHeaders: headers,
		AllowMethods:  []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	// my_middleware
	e.Use(midd.AuthMiddleware)
	e.Use(midd.LogMiddleware)
}

func (g *Gateway) initGRPCConnections() {
	authServer := os.Getenv("AUTH_SERVER")
	services.GrpcAddress = authServer
	services.InitGRPCConnection()
}

func (g *Gateway) defineRoutes(e *echo.Echo) {
	e.GET("/v1/api/public/live", liveHandler)
	routes.StartRoutes(e, g.routes)
}

func liveHandler(c echo.Context) error {
	message := "Server is live at " + time.Now().Format(time.RFC3339)
	return c.JSON(http.StatusOK, map[string]string{
		"status": "ok",
		"msg":    message,
	})
}
