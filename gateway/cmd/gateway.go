package cmd

import (
	"api/gateway/pkg/authorization"
	midd "api/gateway/server/middleware"
	router "api/gateway/server/routes"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Gateway struct {
	routes []router.Route
	port   string
	env    string
	docker bool
}

func NewGateway(env string, port string, docker bool) *Gateway {
	routes, err := router.GatewayRoutes(env, docker)
	if err != nil {
		log.Fatalf("List Routes %v", err)
	}
	return &Gateway{
		routes,
		port,
		env,
		docker,
	}
}

func (g *Gateway) Start() {
	e := echo.New()
	e.HideBanner = true

	g.configureMiddleware(e)
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
		"Authorization", "lang", "x-user-Id", "x-role-key", "x-role-name",
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:  []string{"*"},
		AllowHeaders:  headers,
		ExposeHeaders: headers,
		AllowMethods:  []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	// my_middleware
	// host := os.Getenv("REDIS_HOST")
	// port := os.Getenv("REDIS_PORT")
	// passRedis := os.Getenv("PASSWORD_REDIS")
	authService := authorization.NewAuthorization()

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format:           "${time_custom} | ${method} | URL=${host}${uri} | STATUS=${status} | LATENCY=${latency_human}\n",
		CustomTimeFormat: "2006-01-02 15:04:05",
	}))
	e.Use(midd.AuthMiddleware(authService))
}

func (g *Gateway) defineRoutes(e *echo.Echo) {
	e.GET("/api/v1/public/live", liveHandler)
	router.Routes(e, g.routes)
}

func liveHandler(c echo.Context) error {
	message := "Server is live at " + time.Now().Format(time.RFC3339)
	return c.JSON(http.StatusOK, map[string]string{
		"status": "ok",
		"msg":    message,
	})
}
