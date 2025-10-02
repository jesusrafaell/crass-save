package api

import (
	"crashsaver/incident/handlers"
	"crashsaver/incident/internal/services"
	"crashsaver/incident/middleware"
	"crashsaver/incident/routes"
	"os"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

type Api struct {
	Port string
	db   *mongo.Database
}

func New(port string, db *mongo.Database) *Api {
	return &Api{port, db}
}

func (a *Api) Start() {
	e := echo.New()

	// Middlewares
	e.Use(middleware.LogRequest)
	e.Use(middleware.UserIdRequest)
	// e.Use(middleware.LangRequest)

	notificationService := services.NewNotificationUser()
	incidentServices := services.NewIncidentService(a.db, notificationService)
	routes.Incidents(e, handlers.NewIncidentsHandler(*incidentServices))

	e.HideBanner = true

	port := os.Getenv("PORT")
	e.Logger.Fatal(e.Start(":" + port))
}
